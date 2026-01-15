import { motion } from 'framer-motion';
import { Calendar, DollarSign, Heart } from 'lucide-react';
import { Woman, DateEntry } from '@/types';

interface ContactCardProps {
  woman: Woman;
  dates: DateEntry[];
  onClick: () => void;
}

export const ContactCard = ({ woman, dates, onClick }: ContactCardProps) => {
  const womanDates = dates.filter(d => d.womanId === woman.id);
  const totalSpent = womanDates.reduce((acc, d) => acc + d.amount, 0);
  const lastDate = womanDates.length > 0 
    ? new Date(Math.max(...womanDates.map(d => new Date(d.date).getTime())))
    : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border cursor-pointer transition-colors hover:border-primary/50"
    >
      <div className="relative">
        <img
          src={woman.photo}
          alt={woman.name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/30"
        />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
          <Heart className="w-3 h-3 text-success-foreground" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{woman.name}</h3>
        {woman.nickname && (
          <p className="text-sm text-muted-foreground truncate">{woman.nickname}</p>
        )}
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {womanDates.length} encontros
          </span>
          <span className="flex items-center gap-1 text-primary">
            <DollarSign className="w-3 h-3" />
            R$ {totalSpent.toFixed(0)}
          </span>
        </div>
      </div>

      {lastDate && (
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Último</p>
          <p className="text-sm font-medium text-foreground">
            {lastDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </p>
        </div>
      )}
    </motion.div>
  );
};
