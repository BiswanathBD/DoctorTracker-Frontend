import { AuthService } from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface DashboardStats {
  overview: {
    totalDoctors: number;
    totalPatients: number;
    totalHospitals: number;
    avgPatientsPerDoctor: number;
  };
  patientsPerDoctor: Array<{
    _id: string;
    name: string;
    specialization: string;
    hospital: string;
    patientCount: number;
  }>;
  specializationStats: Array<{
    specialization: string;
    count: number;
  }>;
  conditionStats: Array<{
    condition: string;
    count: number;
  }>;
  timeline: {
    patients: Array<{ date: string; patients: number }>;
    doctors: Array<{ date: string; doctors: number }>;
  };
}

export const DashboardService = {
  async getStats(): Promise<DashboardStats> {
    const token = AuthService.getToken();
    const res = await fetch(`${API_URL}/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'failed to fetch dashboard statistics');
    return data.data;
  },
};
