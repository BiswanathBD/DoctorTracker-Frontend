'use client';

import React from 'react';
import { Card, Button } from '@/components/ui';
import { Stethoscope, Plus, X } from 'lucide-react';

export interface DoctorEmptyStateProps {
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onCreateDoctor: () => void;
}

export const DoctorEmptyState: React.FC<DoctorEmptyStateProps> = ({
  hasActiveFilters,
  onResetFilters,
  onCreateDoctor,
}) => {
  return (
    <Card className="py-16 text-center space-y-4 px-4">
      <div className="w-14 h-14 rounded-2xl bg-accent text-accent-foreground mx-auto flex items-center justify-center">
        <Stethoscope className="w-7 h-7 text-primary" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-foreground text-base">No doctors found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          {hasActiveFilters
            ? 'No doctors match your selected filters. Try adjusting your query or clear all filters.'
            : 'Get started by creating your first doctor profile.'}
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
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="sm"
            onClick={onCreateDoctor}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create First Doctor
          </Button>
        </div>
      )}
    </Card>
  );
};
