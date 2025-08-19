"use client";

import { useState, useEffect, useCallback } from 'react';
import { Property, PaginatedResponse, ApiResponse, PaginationParams } from '@/types/api';

export function useProperties(params: PaginationParams = {}) {
  const [data, setData] = useState<PaginatedResponse<Property> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.search) searchParams.set('search', params.search);
      if (params.status) searchParams.set('status', params.status);

      const response = await fetch(`/api/properties?${searchParams.toString()}`);
      const result: ApiResponse<PaginatedResponse<Property>> = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch properties');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, params.search, params.status]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    data,
    loading,
    error,
    refetch: fetchProperties,
  };
}
