import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Woman } from '@/types';
import { toast } from 'sonner';

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
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem válida');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCustomPhoto(result);
      setSelectedPhoto(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Informe o nome');
      return;
    }
    
    onAdd({
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      phone: phone.trim() || undefined,
      photo: selectedPhoto,
    });
    
    toast.success('Conquista adicionada!');
    setName('');
    setNickname('');
    setPhone('');
    setSelectedPhoto(avatars[0]);
    setCustomPhoto(null);
    onClose();
  };

  const handleClose = () => {
    setName('');
    setNickname('');
    setPhone('');
    setSelectedPhoto(avatars[0]);
    setCustomPhoto(null);
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
          onClick={handleClose}
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
              <button onClick={handleClose} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-muted-foreground mb-3 block">Escolha uma foto</label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {/* Upload button - using label for better mobile support */}
                  <label
                    htmlFor="photo-upload"
                    className="relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden ring-2 ring-dashed ring-primary/50 bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer"
                  >
                    <ImagePlus className="w-6 h-6 text-primary" />
                  </label>
                  <input
                    id="photo-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="sr-only"
                  />

                  {/* Custom uploaded photo */}
                  {customPhoto && (
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(customPhoto)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden ring-2 transition-all ${
                        selectedPhoto === customPhoto ? 'ring-primary scale-110' : 'ring-border'
                      }`}
                    >
                      <img src={customPhoto} alt="Foto personalizada" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </button>
                  )}

                  {/* Preset avatars */}
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
                  placeholder="Nome *"
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
