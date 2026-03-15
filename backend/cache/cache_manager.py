"""
Cache Manager — in-memory TTL caches for analysis results, chat responses, and benchmark data.

Three independent caches:
  - analysis_cache   : full 3-agent pipeline results keyed by dataset_id (TTL: 1 hour)
  - chat_cache       : quick litellm responses keyed by sha256(message + dataset_id) (TTL: 15 min)
  - benchmark_cache  : benchmark query results keyed by category (TTL: 24 hours)

All caches are in-memory only. They reset on server restart.

TODO (when Supabase columns are ready):
  - Persist analysis results to ai_insights table on cache miss, read back on hit
  - Persist benchmark results to benchmarks.fetched_at / benchmarks.ttl_hours columns
"""
import hashlib
import threading
from cachetools import TTLCache

# Max entries, TTL in seconds
_analysis_cache: TTLCache = TTLCache(maxsize=100, ttl=3600)       # 1 hour
_chat_cache: TTLCache = TTLCache(maxsize=500, ttl=900)            # 15 minutes
_benchmark_cache: TTLCache = TTLCache(maxsize=50, ttl=86400)      # 24 hours

# RLocks — TTLCache is not thread-safe; asyncio.to_thread + uvicorn workers can race
_analysis_lock = threading.RLock()
_chat_lock = threading.RLock()
_benchmark_lock = threading.RLock()


# ── Analysis cache ────────────────────────────────────────────────────────────

def get_cached_analysis(dataset_id: str) -> dict | None:
    """Return cached analysis result for a dataset, or None if not cached / expired."""
    with _analysis_lock:
        return _analysis_cache.get(dataset_id)


def set_cached_analysis(dataset_id: str, result: dict) -> None:
    """Store analysis result in cache."""
    with _analysis_lock:
        _analysis_cache[dataset_id] = result


# ── Chat cache ────────────────────────────────────────────────────────────────

def make_chat_key(message: str, user_id: str, dataset_id: str | None) -> str:
    """SHA-256 hash of user_id + message + dataset_id used as cache key."""
    raw = f"{user_id}:{message}:{dataset_id or ''}"
    return hashlib.sha256(raw.encode()).hexdigest()


def get_cached_chat(message: str, user_id: str, dataset_id: str | None) -> str | None:
    """Return cached chat response, or None if not cached / expired."""
    with _chat_lock:
        return _chat_cache.get(make_chat_key(message, user_id, dataset_id))


def set_cached_chat(message: str, user_id: str, dataset_id: str | None, response: str) -> None:
    """Store chat response in cache."""
    with _chat_lock:
        _chat_cache[make_chat_key(message, user_id, dataset_id)] = response


# ── Benchmark cache ───────────────────────────────────────────────────────────

def get_cached_benchmark(category: str) -> str | None:
    """Return cached benchmark JSON string, or None if not cached / expired."""
    with _benchmark_lock:
        return _benchmark_cache.get(category)


def set_cached_benchmark(category: str, result: str) -> None:
    """Store benchmark JSON string in cache."""
    with _benchmark_lock:
        _benchmark_cache[category] = result


# ── Cache stats (useful for debugging) ───────────────────────────────────────

def cache_stats() -> dict:
    with _analysis_lock, _chat_lock, _benchmark_lock:
        return {
            "analysis":  {"size": len(_analysis_cache),  "maxsize": _analysis_cache.maxsize,  "ttl": _analysis_cache.ttl},
            "chat":      {"size": len(_chat_cache),      "maxsize": _chat_cache.maxsize,      "ttl": _chat_cache.ttl},
            "benchmark": {"size": len(_benchmark_cache), "maxsize": _benchmark_cache.maxsize, "ttl": _benchmark_cache.ttl},
        }
