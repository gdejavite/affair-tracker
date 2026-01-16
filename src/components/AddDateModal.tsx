import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, DollarSign, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Woman, DateEntry } from '@/types';
import { toast } from 'sonner';

interface AddDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (date: Omit<DateEntry, 'id'>) => void;
  women: Woman[];
}

export const AddDateModal = ({ isOpen, onClose, onAdd, women }: AddDateModalProps) => {
  const [selectedWoman, setSelectedWoman] = useState<string>('');
  const [location, setLocation] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<{ woman?: boolean; location?: boolean }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { woman?: boolean; location?: boolean } = {};
    
    if (!selectedWoman) {
      newErrors.woman = true;
    }
    if (!location.trim()) {
      newErrors.location = true;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Preencha os campos obrigatórios', {
        description: !selectedWoman ? 'Selecione uma conquista' : 'Informe o local do encontro',
      });
      return;
    }
    
    setErrors({});
    
    onAdd({
      womanId: selectedWoman,
      location: location.trim(),
      amount: parseFloat(amount) || 0,
      date: new Date(date),
      rating: rating > 0 ? rating : undefined,
    });
    
    toast.success('Encontro registrado!');
    
    setSelectedWoman('');
    setLocation('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setRating(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-card rounded-t-3xl p-6 pb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Novo Encontro</h2>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`text-sm mb-3 block ${errors.woman ? 'text-destructive' : 'text-muted-foreground'}`}>
                  Com quem? {errors.woman && <span className="text-destructive">*</span>}
                </label>
                <div className={`flex gap-3 overflow-x-auto pb-2 ${errors.woman ? 'ring-2 ring-destructive/50 rounded-xl p-1' : ''}`}>
                  {women.map((woman) => (
                    <button
                      key={woman.id}
                      type="button"
                      onClick={() => {
                        setSelectedWoman(woman.id);
                        setErrors(prev => ({ ...prev, woman: false }));
                      }}
                      className={`relative flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        selectedWoman === woman.id ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-muted'
                      }`}
                    >
                      <img src={woman.photo} alt={woman.name} className="w-12 h-12 rounded-full object-cover" />
                      <span className="text-xs text-foreground">{woman.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-muted border-0 h-12 pl-11"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.location ? 'text-destructive' : 'text-muted-foreground'}`} />
                  <Input
                    placeholder="Local do encontro *"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setErrors(prev => ({ ...prev, location: false }));
                    }}
                    className={`bg-muted border-0 h-12 pl-11 ${errors.location ? 'ring-2 ring-destructive/50' : ''}`}
                  />
                </div>
                
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Quanto gastou? (R$)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-muted border-0 h-12 pl-11"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-3 block">Como foi?</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold">
                Registrar Encontro
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
