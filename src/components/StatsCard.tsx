import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext?: string;
  variant?: 'default' | 'primary';
}

export const StatsCard = ({ icon: Icon, label, value, subtext, variant = 'default' }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-2xl ${
        variant === 'primary' 
          ? 'bg-gradient-to-br from-primary to-gold-dark text-primary-foreground' 
          : 'bg-card border border-border'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
        variant === 'primary' 
          ? 'bg-primary-foreground/20' 
          : 'bg-primary/10'
      }`}>
        <Icon className={`w-5 h-5 ${variant === 'primary' ? 'text-primary-foreground' : 'text-primary'}`} />
      </div>
      <p className={`text-xs ${variant === 'primary' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
        {label}
      </p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtext && (
        <p className={`text-xs mt-1 ${variant === 'primary' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
          {subtext}
        </p>
      )}
    </motion.div>
  );
};
