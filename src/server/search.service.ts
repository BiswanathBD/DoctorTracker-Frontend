import { apiClient } from './api.client';

export interface DoctorSearchItem {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  avatar?: {
    url: string;
    key?: string;
  };
}

export interface PatientSearchItem {
  _id: string;
  name: string;
  condition: string;
  isReleased: boolean;
  avatar?: {
    url: string;
    key?: string;
  };
  doctorName: string;
}

export interface SearchData {
  doctors: DoctorSearchItem[];
  patients: PatientSearchItem[];
  total: number;
  totalDoctors: number;
  totalPatients: number;
}

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const SearchService = {
  async globalSearch(searchTerm: string, limit = 5): Promise<SearchData> {
    const res = await apiClient<ApiResponse<SearchData>>('/search', {
      params: {
        searchTerm,
        limit,
      },
    });
    return res.data || { doctors: [], patients: [], total: 0, totalDoctors: 0, totalPatients: 0 };
  },
};

