'use client';

import { useState, useEffect, useCallback } from 'react';
import { DoctorService, type Doctor } from '@/server/doctor.service';
import { toast } from '@/components/ui';

export function useDoctors(limit = 9) {
  // state for list, pagination & filters
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // filter states
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const isDebouncing = searchInput !== debouncedSearch;
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortValue, setSortValue] = useState('createdAt-desc');

  // filter options fetched from database
  const [specializationsList, setSpecializationsList] = useState<string[]>([]);
  const [hospitalsList, setHospitalsList] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // typing delay debounce for database search (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // fetch distinct filter options directly from database
  const fetchFilterOptions = useCallback(async () => {
    try {
      setLoadingFilters(true);
      const [specs, hosps] = await Promise.all([
        DoctorService.getSpecializations(),
        DoctorService.getHospitals(),
      ]);
      setSpecializationsList(specs);
      setHospitalsList(hosps);
    } catch (err) {
      console.error('failed to fetch filter options from database:', err);
    } finally {
      setLoadingFilters(false);
    }
  }, []);

  // load filter options from database on mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([DoctorService.getSpecializations(), DoctorService.getHospitals()])
      .then(([specs, hosps]) => {
        if (!isMounted) return;
        setSpecializationsList(specs);
        setHospitalsList(hosps);
      })
      .catch((err) => console.error('initial filter load failed:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // fetch doctors list with database search, filters & pagination
  const refreshDoctors = useCallback(() => {
    const [sortBy, sortOrder] = (sortValue.split('-') || ['createdAt', 'desc']) as [
      string,
      'asc' | 'desc'
    ];

    DoctorService.getAllDoctors({
      page,
      limit,
      searchTerm: debouncedSearch.trim() || undefined,
      specialization: specialization || undefined,
      hospital: hospital || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy,
      sortOrder,
    })
      .then((res) => {
        setDoctors(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages || 1);
      })
      .catch((err) => {
        console.error('failed to fetch doctors:', err);
        toast.error('Network Error', 'Could not load doctors list.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, limit, debouncedSearch, specialization, hospital, startDate, endDate, sortValue]);

  // load doctors on query/filter changes
  useEffect(() => {
    let isMounted = true;
    const [sortBy, sortOrder] = (sortValue.split('-') || ['createdAt', 'desc']) as [
      string,
      'asc' | 'desc'
    ];

    DoctorService.getAllDoctors({
      page,
      limit,
      searchTerm: debouncedSearch.trim() || undefined,
      specialization: specialization || undefined,
      hospital: hospital || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy,
      sortOrder,
    })
      .then((res) => {
        if (!isMounted) return;
        setDoctors(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages || 1);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('failed to fetch doctors:', err);
        toast.error('Network Error', 'Could not load doctors list.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, limit, debouncedSearch, specialization, hospital, startDate, endDate, sortValue]);

  const handleResetFilters = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
    setSpecialization('');
    setHospital('');
    setStartDate('');
    setEndDate('');
    setSortValue('createdAt-desc');
    setPage(1);
  }, []);

  const hasActiveFilters = Boolean(
    debouncedSearch ||
      specialization ||
      hospital ||
      startDate ||
      endDate ||
      sortValue !== 'createdAt-desc'
  );

  return {
    doctors,
    setDoctors,
    loading,
    total,
    totalPages,
    page,
    setPage,
    limit,
    refreshDoctors,
    fetchFilterOptions,
    hasActiveFilters,
    handleResetFilters,
    filterProps: {
      searchInput,
      setSearchInput,
      debouncedSearch,
      isDebouncing,
      specialization,
      setSpecialization,
      specializationsList,
      hospital,
      setHospital,
      hospitalsList,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      sortValue,
      setSortValue,
      total,
      loading,
      loadingFilters,
      onResetFilters: handleResetFilters,
      setPage,
    },
  };
}
