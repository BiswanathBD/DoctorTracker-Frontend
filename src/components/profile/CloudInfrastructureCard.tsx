'use client';

import React from 'react';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Card } from '@/components/ui';
import {
  Server,
  Cloud,
  Database,
  Layers,
  Globe,
} from 'lucide-react';

export const CloudInfrastructureCard: React.FC = () => {
  return (
    <MotionWrapper delay={0.25} direction="up">
      <Card className="p-6 space-y-5 border border-border/80 bg-card/90 backdrop-blur-xl shadow-lg rounded-3xl">
        {/* card header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Cloud Infrastructure & Storage</h3>
              <p className="text-[11px] text-muted-foreground">Media pipeline, aggregation indexing, and runtime</p>
            </div>
          </div>
          <span className="text-primary font-semibold text-[11px] flex items-center gap-1.5 bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
            <Layers className="w-3.5 h-3.5 text-primary" />
            v1.0.0
          </span>
        </div>

        {/* infrastructure blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Cloud className="w-3 h-3 text-primary" />
              Cloudinary CDN Storage
            </span>
            <p className="font-bold text-foreground">Active Media Storage</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Automated multipart image uploads with automatic orphan deletion to prevent stale storage.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Database className="w-3 h-3 text-secondary" />
              MongoDB Cluster
            </span>
            <p className="font-bold text-foreground">Aggregation Engine</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Text search indices, dynamic pagination pipelines, and foreign key population across doctors and patients.
            </p>
          </div>
        </div>

        {/* card footer */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60">
          <span>Architecture: <strong>Next.js 16 + Express REST API</strong></span>
          <span className="text-secondary font-semibold flex items-center gap-1">
            <Globe className="w-3 h-3 text-secondary" />
            Cloud Connected
          </span>
        </div>
      </Card>
    </MotionWrapper>
  );
};
