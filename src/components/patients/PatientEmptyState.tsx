'use client';

import React from 'react';
import { Card, Button } from '@/components/ui';
import { Users, Plus, X } from 'lucide-react';

export interface PatientEmptyStateProps {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onCreatePatient: () => void;
}

export const PatientEmptyState: React.FC<PatientEmptyStateProps> = ({
  hasActiveFilters,
  onResetFilters,
  onCreatePatient,
}) => {
  return (
    <Card className="py-16 text-center space-y-4 px-4">
      <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary mx-auto flex items-center justify-center">
        <Users className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-foreground text-base">No patients found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          {hasActiveFilters
            ? 'No patients match your selected query and filters. Try adjusting your search or clear filters.'
            : 'Get started by admitting and registering your first patient record.'}
        </p>
      </div>
      {hasActiveFilters ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            leftIcon={<X className="w-3.5 h-3.5" />}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={onCreatePatient}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Register First Patient
          </Button>
        </div>
      )}
    </Card>
  );
};
