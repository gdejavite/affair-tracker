import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Calendar, MapPin, DollarSign, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Woman, DateEntry } from '@/types';

interface ContactDetailProps {
  woman: Woman | null;
  dates: DateEntry[];
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onDeleteDate: (id: string) => void;
}

export const ContactDetail = ({ woman, dates, isOpen, onClose, onDelete, onDeleteDate }: ContactDetailProps) => {
  if (!woman) return null;

  const womanDates = dates.filter(d => d.womanId === woman.id).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const totalSpent = womanDates.reduce((acc, d) => acc + d.amount, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card overflow-y-auto"
          >
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-primary to-gold-dark" />
              <button 
                onClick={onClose}
                className="absolute top-4 left-4 p-2 bg-background/20 backdrop-blur rounded-full"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              <button 
                onClick={() => {
                  onDelete(woman.id);
                  onClose();
                }}
                className="absolute top-4 right-4 p-2 bg-destructive/80 backdrop-blur rounded-full"
              >
                <Trash2 className="w-5 h-5 text-destructive-foreground" />
              </button>
              <img
                src={woman.photo}
                alt={woman.name}
                className="absolute left-1/2 -translate-x-1/2 -bottom-16 w-32 h-32 rounded-full object-cover ring-4 ring-card"
              />
            </div>

            <div className="pt-20 px-6 pb-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">{woman.name}</h2>
                {woman.nickname && (
                  <p className="text-muted-foreground">{woman.nickname}</p>
                )}
                {woman.phone && (
                  <a href={`tel:${woman.phone}`} className="inline-flex items-center gap-2 mt-2 text-primary">
                    <Phone className="w-4 h-4" />
                    {woman.phone}
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-muted text-center">
                  <p className="text-2xl font-bold text-primary">R$ {totalSpent.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">Total gasto</p>
                </div>
                <div className="p-4 rounded-xl bg-muted text-center">
                  <p className="text-2xl font-bold text-foreground">{womanDates.length}</p>
                  <p className="text-sm text-muted-foreground">Encontros</p>
                </div>
              </div>

              <h3 className="font-semibold text-foreground mb-4">Histórico de Encontros</h3>
              
              {womanDates.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum encontro registrado ainda
                </p>
              ) : (
                <div className="space-y-3">
                  {womanDates.map((dateEntry) => (
                    <motion.div
                      key={dateEntry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-muted"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            {new Date(dateEntry.date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {dateEntry.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-primary font-medium">
                            <DollarSign className="w-4 h-4" />
                            R$ {dateEntry.amount.toFixed(2)}
                          </div>
                          {dateEntry.rating && (
                            <div className="flex items-center gap-1 pt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= dateEntry.rating! ? 'fill-primary text-primary' : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => onDeleteDate(dateEntry.id)}
                          className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
