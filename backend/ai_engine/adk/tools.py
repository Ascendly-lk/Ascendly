"""
ADK Data Fetching Tools
-----------------------
Plain Python functions used as tools by the three benchmark ADK agents.
Each function fetches live data from a specific external source.

Tools:
  - fetch_world_bank        → World Bank API (free, no key required)
  - fetch_alpha_vantage_sector → Alpha Vantage sector performance (ALPHA_VANTAGE_API_KEY)
  - fetch_serp_competitors  → SerpAPI Google Search (SERPAPI_API_KEY)
  - fetch_yahoo_sector      → Yahoo Finance via yfinance (free, no key required)

All tools return a dict (required by ADK). On failure they return {"error": "..."}
so the agent can gracefully handle the fallback.
"""
import os
import requests


# ── World Bank ─────────────────────────────────────────────────────────────────

def fetch_world_bank(category: str) -> dict:
    """
    Fetch industry growth benchmark data from the World Bank Open Data API.
    Returns GDP growth, FDI inflows, and sector indicators for relevant industries.

    Args:
        category: Benchmark category — 'industry_growth' or 'competitor'
    """
    try:
        # GDP growth rate (annual %) — indicator NY.GDP.MKTP.KD.ZG
        url = "https://api.worldbank.org/v2/country/WLD/indicator/NY.GDP.MKTP.KD.ZG"
        resp = requests.get(url, params={"format": "json", "mrv": 3, "per_page": 5}, timeout=8)
        resp.raise_for_status()
        data = resp.json()

        records = []
        if isinstance(data, list) and len(data) > 1:
            for entry in data[1] or []:
                if entry.get("value") is not None:
                    records.append({
                        "name": "Global GDP Growth",
                        "metric": "annual_growth_rate",
                        "value": round(float(entry["value"]), 2),
                        "unit": "%",
                        "period": str(entry.get("date", "")),
                        "source": "World Bank",
                    })

        return {"source": "world_bank", "records": records, "count": len(records)}

    except Exception as e:
        return {"error": f"World Bank fetch failed: {str(e)}", "source": "world_bank", "records": []}


# ── Alpha Vantage ──────────────────────────────────────────────────────────────

def fetch_alpha_vantage_sector() -> dict:
    """
    Fetch sector performance data from Alpha Vantage.
    Returns weekly and monthly performance for Technology, Financials, Healthcare, and other sectors.
    Requires ALPHA_VANTAGE_API_KEY environment variable.
    """
    try:
        api_key = os.getenv("ALPHA_VANTAGE_API_KEY")
        if not api_key:
            return {"error": "ALPHA_VANTAGE_API_KEY not set", "source": "alpha_vantage", "records": []}

        url = "https://www.alphavantage.co/query"
        resp = requests.get(url, params={"function": "SECTOR", "apikey": api_key}, timeout=8)
        resp.raise_for_status()
        data = resp.json()

        records = []
        rank_key = "Rank A: Real-Time Performance"
        if rank_key in data:
            for sector, perf in data[rank_key].items():
                try:
                    value = float(perf.strip("%"))
                    records.append({
                        "name": sector,
                        "metric": "sector_performance",
                        "value": value,
                        "unit": "%",
                        "period": "real_time",
                        "source": "Alpha Vantage",
                    })
                except (ValueError, AttributeError):
                    continue

        return {"source": "alpha_vantage", "records": records, "count": len(records)}

    except Exception as e:
        return {"error": f"Alpha Vantage fetch failed: {str(e)}", "source": "alpha_vantage", "records": []}


# ── SerpAPI ────────────────────────────────────────────────────────────────────

def fetch_serp_competitors(category: str) -> dict:
    """
    Search for competitor revenue and growth data using SerpAPI Google Search.
    Returns structured competitor information extracted from search results.
    Requires SERPAPI_API_KEY environment variable.

    Args:
        category: Benchmark category to guide the search query
    """
    try:
        api_key = os.getenv("SERPAPI_API_KEY")
        if not api_key:
            return {"error": "SERPAPI_API_KEY not set", "source": "serpapi", "records": []}

        query = "SaaS startup revenue growth benchmarks 2024 industry average" \
            if category == "industry_growth" \
            else "top SaaS startup competitors revenue ARR growth 2024"

        url = "https://serpapi.com/search"
        resp = requests.get(url, params={
            "q": query,
            "api_key": api_key,
            "engine": "google",
            "num": 5,
        }, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        records = []
        for result in data.get("organic_results", [])[:5]:
            records.append({
                "name": result.get("title", "Unknown"),
                "metric": "competitor_data",
                "value": 0,
                "unit": "reference",
                "period": "2024",
                "source": "SerpAPI",
                "snippet": result.get("snippet", "")[:200],
                "link": result.get("link", ""),
            })

        return {"source": "serpapi", "records": records, "count": len(records)}

    except Exception as e:
        return {"error": f"SerpAPI fetch failed: {str(e)}", "source": "serpapi", "records": []}


# ── Yahoo Finance ──────────────────────────────────────────────────────────────

def fetch_yahoo_sector(category: str) -> dict:
    """
    Fetch sector and market benchmark data from Yahoo Finance using yfinance.
    Returns performance data for major sector ETFs (XLK, XLF, XLV, SPY).

    Args:
        category: Benchmark category — used to select relevant sector ETFs
    """
    try:
        import yfinance as yf

        # Sector ETFs covering major industries
        tickers = {
            "XLK": "Technology",
            "XLF": "Financials",
            "XLV": "Healthcare",
            "XLC": "Communications",
            "SPY": "S&P 500 (Market)",
        }

        records = []
        for symbol, sector_name in tickers.items():
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="3mo")
                if hist.empty:
                    continue
                start_price = float(hist["Close"].iloc[0])
                end_price = float(hist["Close"].iloc[-1])
                change_pct = round(((end_price - start_price) / start_price) * 100, 2)
                records.append({
                    "name": sector_name,
                    "metric": "3mo_price_change",
                    "value": change_pct,
                    "unit": "%",
                    "period": "3_months",
                    "source": "Yahoo Finance",
                })
            except Exception:
                continue

        return {"source": "yahoo_finance", "records": records, "count": len(records)}

    except Exception as e:
        return {"error": f"Yahoo Finance fetch failed: {str(e)}", "source": "yahoo_finance", "records": []}
