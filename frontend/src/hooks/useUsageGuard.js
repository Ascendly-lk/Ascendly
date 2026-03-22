/**
 * useUsageGuard
 *
 * Wraps apiFetch to intercept 429 LIMIT_REACHED responses and
 * surface the pricing modal.
 *
 * Usage:
 *   const { guardedFetch, showPricingModal, limitError, closePricingModal } = useUsageGuard();
 *   const res = await guardedFetch('/api/chat', { method: 'POST', ... });
 */
import { useState, useCallback } from 'react';
import { apiFetch } from '../api';

export function useUsageGuard() {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [limitError, setLimitError] = useState(null);

  const guardedFetch = useCallback(async (url, options = {}) => {
    const res = await apiFetch(url, options);

    if (res.status === 429) {
      try {
        const body = await res.clone().json();
        if (body?.detail?.code === 'LIMIT_REACHED') {
          setLimitError(body.detail);
          setShowPricingModal(true);
          return res; // caller can check res.status === 429
        }
      } catch {
        // non-JSON 429 — surface modal with sensible defaults so UI renders cleanly
        setLimitError({ code: 'LIMIT_REACHED', tier: 'free', action: 'requests', used: 0, limit: 0 });
        setShowPricingModal(true);
      }
    }

    return res;
  }, []);

  const closePricingModal = useCallback(() => {
    setShowPricingModal(false);
    setLimitError(null);
  }, []);

  return { guardedFetch, showPricingModal, limitError, closePricingModal };
}
