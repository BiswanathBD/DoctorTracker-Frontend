import React from 'react';
import { MotionWrapper } from '@/components/common/MotionWrapper';
import { Card } from '@/components/ui';
import {
  Lock,
  KeyRound,
  Shield,
  ShieldCheck,
  Radio,
} from 'lucide-react';

export const SecurityProtocolsCard: React.FC = () => {
  return (
    <MotionWrapper delay={0.2} direction="up">
      <Card className="p-6 space-y-5 border border-border/80 bg-card/90 backdrop-blur-xl shadow-lg rounded-3xl">
        {/* card header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Security & Session Protocols</h3>
              <p className="text-[11px] text-muted-foreground">Encryption standards and cookie parameters</p>
            </div>
          </div>
          <span className="text-success font-semibold text-[11px] flex items-center gap-1 bg-success/10 px-2.5 py-0.5 rounded-full border border-success/20">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            Protected
          </span>
        </div>

        {/* protocol blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <KeyRound className="w-3 h-3 text-primary" />
              Authentication Protocol
            </span>
            <p className="font-bold text-foreground">JSON Web Tokens (JWT)</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Signed with HMAC-SHA256 and stored in secure cookies with a 7-day expiration.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-success" />
              Password Hash Engine
            </span>
            <p className="font-bold text-foreground">Bcrypt (Salt Rounds: 12)</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Zero plaintext password persistence with salted cryptographic hashing.
            </p>
          </div>
        </div>

        {/* card footer */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60">
          <span>Active Session: <strong>7-Day Token Lifespan</strong></span>
          <span className="text-primary font-semibold flex items-center gap-1">
            <Radio className="w-3 h-3 text-primary" />
            Encrypted Transmission
          </span>
        </div>
      </Card>
    </MotionWrapper>
  );
};
