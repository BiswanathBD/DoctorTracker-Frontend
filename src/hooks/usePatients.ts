'use client';

import { useState, useEffect, useCallback } from 'react';
import { PatientService, type Patient } from '@/server/patient.service';
import { DoctorService, type Doctor } from '@/server/doctor.service';
import { toast } from '@/components/ui';

export function usePatients(limit = 9) {
  // state for patients list & pagination
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // filters and search state
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const isDebouncing = searchInput !== debouncedSearch;

  const [condition, setCondition] = useState('');
  const [gender, setGender] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<'under_care' | 'released' | 'all'>('under_care');
  const [sortValue, setSortValue] = useState('createdAt-desc');

  // filter options fetched directly from database
  const [conditionsList, setConditionsList] = useState<string[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
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
      const [conds, docsRes] = await Promise.all([
        PatientService.getConditions(),
        DoctorService.getAllDoctors({ page: 1, limit: 100 }),
      ]);
      setConditionsList(conds);
      setDoctorsList(docsRes.data);
    } catch (err) {
      console.error('failed to fetch filter options from database:', err);
    } finally {
      setLoadingFilters(false);
    }
  }, []);

  // load filter options from database on mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      PatientService.getConditions(),
      DoctorService.getAllDoctors({ page: 1, limit: 100 }),
    ])
      .then(([conds, docsRes]) => {
        if (!isMounted) return;
        setConditionsList(conds);
        setDoctorsList(docsRes.data);
      })
      .catch((err) => console.error('failed to fetch filter options:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // refresh patients list
  const refreshPatients = useCallback(() => {
    const [sortBy, sortOrder] = (sortValue.split('-') || ['createdAt', 'desc']) as [
      string,
      'asc' | 'desc'
    ];
    const isReleasedParam =
      statusFilter === 'under_care' ? false : statusFilter === 'released' ? true : undefined;

    PatientService.getAllPatients({
      page,
      limit,
      searchTerm: debouncedSearch.trim() || undefined,
      condition: condition || undefined,
      gender: gender || undefined,
      doctorId: doctorId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      isReleased: isReleasedParam,
      sortBy,
      sortOrder,
    })
      .then((res) => {
        setPatients(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'failed to load patients';
        toast.error('Error loading patients', msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, limit, debouncedSearch, condition, gender, doctorId, startDate, endDate, statusFilter, sortValue]);

  // fetch patients on filter changes
  useEffect(() => {
    let isMounted = true;
    const [sortBy, sortOrder] = (sortValue.split('-') || ['createdAt', 'desc']) as [
      string,
      'asc' | 'desc'
    ];
    const isReleasedParam =
      statusFilter === 'under_care' ? false : statusFilter === 'released' ? true : undefined;

    PatientService.getAllPatients({
      page,
      limit,
      searchTerm: debouncedSearch.trim() || undefined,
      condition: condition || undefined,
      gender: gender || undefined,
      doctorId: doctorId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      isReleased: isReleasedParam,
      sortBy,
      sortOrder,
    })
      .then((res) => {
        if (!isMounted) return;
        setPatients(res.data);
        setTotal(res.meta.total);
        setTotalPages(res.meta.totalPages);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'failed to load patients';
        toast.error('Error loading patients', msg);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, limit, debouncedSearch, condition, gender, doctorId, startDate, endDate, statusFilter, sortValue]);

  // reset all filters
  const handleResetFilters = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
    setCondition('');
    setGender('');
    setDoctorId('');
    setStartDate('');
    setEndDate('');
    setStatusFilter('under_care');
    setSortValue('createdAt-desc');
    setPage(1);
  }, []);

  const hasActiveFilters = Boolean(
    debouncedSearch ||
      condition ||
      gender ||
      doctorId ||
      startDate ||
      endDate ||
      statusFilter !== 'under_care' ||
      sortValue !== 'createdAt-desc'
  );

  return {
    patients,
    setPatients,
    loading,
    total,
    totalPages,
    page,
    setPage,
    limit,
    doctorsList,
    refreshPatients,
    fetchFilterOptions,
    hasActiveFilters,
    handleResetFilters,
    filterProps: {
      searchInput,
      setSearchInput,
      debouncedSearch,
      isDebouncing,
      condition,
      setCondition,
      conditionsList,
      doctorId,
      setDoctorId,
      doctorsList,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      gender,
      setGender,
      statusFilter,
      setStatusFilter,
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
