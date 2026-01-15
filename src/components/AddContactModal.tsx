import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Woman } from '@/types';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (woman: Omit<Woman, 'id' | 'createdAt'>) => void;
}

const avatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop',
];

export const AddContactModal = ({ isOpen, onClose, onAdd }: AddContactModalProps) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(avatars[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAdd({
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      phone: phone.trim() || undefined,
      photo: selectedPhoto,
    });
    
    setName('');
    setNickname('');
    setPhone('');
    setSelectedPhoto(avatars[0]);
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
              <h2 className="text-xl font-bold text-foreground">Nova Conquista</h2>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-muted-foreground mb-3 block">Escolha uma foto</label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedPhoto(avatar)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden ring-2 transition-all ${
                        selectedPhoto === avatar ? 'ring-primary scale-110' : 'ring-border'
                      }`}
                    >
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted border-0 h-12"
                />
                <Input
                  placeholder="Apelido (opcional)"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="bg-muted border-0 h-12"
                />
                <Input
                  placeholder="Telefone (opcional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-muted border-0 h-12"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold">
                Adicionar
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
