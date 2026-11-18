'use client';

import React from 'react';
import { Modal, Badge, Button } from '@/components/ui';
import type { Doctor, DoctorPatient } from '@/types/doctor.types';
import { Building2, UserPlus, Users, UserCheck } from 'lucide-react';

export interface DoctorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onAddPatient: () => void;
  onRemovePatient?: (patientId: string, patientName: string) => void;
  onReleasePatient?: (patient: DoctorPatient) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onAddPatient,
  onRemovePatient,
  onReleasePatient,
}) => {
  if (!doctor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={doctor.name || 'Doctor Details'}
      description={`Specialist profile and corresponding patient list (${doctor.patientCount || 0} assigned)`}
      maxWidth="lg"
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* scrollable center content */}
        <div className="flex-1 overflow-y-auto no-scrollbar scrollbar-none p-6 space-y-5">
          {/* doctor summary card */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground font-semibold">Specialization</p>
            <Badge variant="primary" className="mt-1">
              {doctor.specialization}
            </Badge>
          </div>
          <div>
            <p className="text-muted-foreground font-semibold">Hospital</p>
            <p className="font-bold text-foreground mt-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
              {doctor.hospital}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground font-semibold">Contact Info</p>
            <p className="text-foreground font-medium mt-1">{doctor.phone}</p>
            <p className="text-muted-foreground text-[11px] truncate">{doctor.email}</p>
          </div>
        </div>

        {/* assigned patients section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-foreground">Corresponding Patients</h4>
              <p className="text-[11px] text-muted-foreground">
                Patients receiving care under Dr. {doctor.name}
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              onClick={onAddPatient}
            >
              Add Patient Under Doctor
            </Button>
          </div>

          {doctor.patients && doctor.patients.length > 0 ? (
            <div className="border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[10px] uppercase font-bold text-muted-foreground">
                    <th className="py-2.5 px-3">Patient Name</th>
                    <th className="py-2.5 px-3">Age / Gender</th>
                    <th className="py-2.5 px-3">Condition</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {doctor.patients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-foreground">{patient.name}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {patient.age} yrs • {patient.gender}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant="warning">{patient.condition}</Badge>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">{patient.phone}</td>
                      <td className="py-2.5 px-3 text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (onReleasePatient) {
                              onReleasePatient(patient);
                            } else if (onRemovePatient) {
                              onRemovePatient(patient._id, patient.name);
                            }
                          }}
                          className="text-secondary border-secondary/30 hover:bg-secondary/10 text-xs py-1 px-2.5 font-semibold"
                        >
                          <UserCheck className="w-3.5 h-3.5 mr-1" />
                          Release
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-muted/30 border border-dashed border-border text-center space-y-2">
              <Users className="w-6 h-6 text-muted-foreground mx-auto" />
              <p className="text-xs font-bold text-foreground">No patients assigned yet</p>
              <p className="text-[11px] text-muted-foreground">
                Click &ldquo;Add Patient Under Doctor&rdquo; above to assign a patient record.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* fixed footer following Profile Drawer 1:1 */}
      <div className="shrink-0 p-5 px-6 border-t border-border/80 bg-card/95 backdrop-blur-md flex items-center justify-end z-10">
        <Button variant="destructive" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
    </Modal>
  );
};
