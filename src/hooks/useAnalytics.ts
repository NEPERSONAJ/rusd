import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../lib/services/analyticsService';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Track page view whenever location changes
    analyticsService.trackVisit(location.pathname);
  }, [location]);
}