import { apiClient } from './api.client';
import type { Patient, PatientQueryParams, PatientsResponse } from '@/types/patient.types';

export type { Patient, PatientQueryParams, PatientsResponse };

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export const PatientService = {
  // get all patients with query params
  async getAllPatients(params: PatientQueryParams = {}): Promise<PatientsResponse> {
    const res = await apiClient<ApiResponse<Patient[]> & { meta?: PatientsResponse['meta'] }>('/patients', {
      params: {
        page: params.page,
        limit: params.limit,
        searchTerm: params.searchTerm,
        condition: params.condition,
        gender: params.gender,
        doctorId: params.doctorId,
        unassigned: params.unassigned,
        startDate: params.startDate,
        endDate: params.endDate,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        isReleased: params.isReleased,
      },
    });

    return {
      meta: res.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      data: res.data || [],
    };
  },

  // get single patient by id
  async getPatientById(id: string): Promise<Patient> {
    const res = await apiClient<ApiResponse<Patient>>(`/patients/${id}`);
    return res.data;
  },

  // create a new patient
  async createPatient(payload: Record<string, unknown>): Promise<Patient> {
    const res = await apiClient<ApiResponse<Patient>>('/patients', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // update patient
  async updatePatient(id: string, payload: Record<string, unknown>): Promise<Patient> {
    const res = await apiClient<ApiResponse<Patient>>(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // update patient avatar
  async updateAvatar(patientId: string, file: File): Promise<Patient> {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await apiClient<ApiResponse<Patient>>(`/patients/${patientId}/avatar`, {
      method: 'PATCH',
      body: formData,
    });
    return res.data;
  },

  // delete patient avatar
  async deleteAvatar(patientId: string): Promise<Patient> {
    const res = await apiClient<ApiResponse<Patient>>(`/patients/${patientId}/avatar`, {
      method: 'DELETE',
    });
    return res.data;
  },

  // delete patient
  async deletePatient(id: string): Promise<void> {
    await apiClient(`/patients/${id}`, {
      method: 'DELETE',
    });
  },

  // release patient
  async releasePatient(id: string, releaseDate?: string, note?: string): Promise<Patient> {
    const res = await apiClient<ApiResponse<Patient>>(`/patients/${id}/release`, {
      method: 'PATCH',
      body: JSON.stringify({ releaseDate, note }),
    });
    return res.data;
  },

  // readmit patient
  async readmitPatient(id: string, doctorId?: string): Promise<Patient> {
    const res = await apiClient<ApiResponse<Patient>>(`/patients/${id}/readmit`, {
      method: 'PATCH',
      body: JSON.stringify({ doctorId }),
    });
    return res.data;
  },

  // get distinct conditions
  async getConditions(): Promise<string[]> {
    const res = await apiClient<ApiResponse<string[]>>('/patients/conditions');
    return res.data || [];
  },
};
