import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactCard } from '@/components/ContactCard';
import { StatsCard } from '@/components/StatsCard';
import { AddContactModal } from '@/components/AddContactModal';
import { AddDateModal } from '@/components/AddDateModal';
import { ContactDetail } from '@/components/ContactDetail';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Woman, DateEntry } from '@/types';

const Index = () => {
  const [women, setWomen] = useLocalStorage<Woman[]>('women', []);
  const [dates, setDates] = useLocalStorage<DateEntry[]>('dates', []);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddDate, setShowAddDate] = useState(false);
  const [selectedWoman, setSelectedWoman] = useState<Woman | null>(null);

  const stats = useMemo(() => {
    const totalSpent = dates.reduce((acc, d) => acc + d.amount, 0);
    const totalDates = dates.length;
    const averagePerDate = totalDates > 0 ? totalSpent / totalDates : 0;
    
    const spendingByWoman = dates.reduce((acc, d) => {
      acc[d.womanId] = (acc[d.womanId] || 0) + d.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const mostExpensiveId = Object.entries(spendingByWoman).sort((a, b) => b[1] - a[1])[0]?.[0];
    const mostExpensive = women.find(w => w.id === mostExpensiveId) || null;
    
    return { totalSpent, totalDates, averagePerDate, mostExpensive };
  }, [women, dates]);

  const handleAddWoman = (newWoman: Omit<Woman, 'id' | 'createdAt'>) => {
    const woman: Woman = {
      ...newWoman,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setWomen([...women, woman]);
  };

  const handleAddDate = (newDate: Omit<DateEntry, 'id'>) => {
    const dateEntry: DateEntry = {
      ...newDate,
      id: crypto.randomUUID(),
    };
    setDates([...dates, dateEntry]);
  };

  const handleDeleteWoman = (id: string) => {
    setWomen(women.filter(w => w.id !== id));
    setDates(dates.filter(d => d.womanId !== id));
  };

  const handleDeleteDate = (id: string) => {
    setDates(dates.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-muted-foreground">Olá, Campeão 👑</p>
          <h1 className="text-3xl font-bold text-foreground mt-1">
            Seu <span className="text-primary">Controle</span>
          </h1>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 grid grid-cols-2 gap-4 mb-8">
        <StatsCard
          icon={DollarSign}
          label="Total Investido"
          value={`R$ ${stats.totalSpent.toFixed(0)}`}
          variant="primary"
        />
        <StatsCard
          icon={Calendar}
          label="Encontros"
          value={stats.totalDates.toString()}
          subtext="este mês"
        />
        <StatsCard
          icon={TrendingUp}
          label="Média/Encontro"
          value={`R$ ${stats.averagePerDate.toFixed(0)}`}
        />
        <StatsCard
          icon={Users}
          label="Conquistas"
          value={women.length.toString()}
          subtext="ativas"
        />
      </div>

      {/* Contacts Section */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Suas Conquistas</h2>
          <Button
            size="sm"
            variant="ghost"
            className="text-primary"
            onClick={() => setShowAddContact(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Nova
          </Button>
        </div>

        {women.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">
              Nenhuma conquista ainda.<br />
              Comece adicionando alguém especial!
            </p>
            <Button onClick={() => setShowAddContact(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3 pb-24">
            {women.map((woman, index) => (
              <motion.div
                key={woman.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ContactCard
                  woman={woman}
                  dates={dates}
                  onClick={() => setSelectedWoman(woman)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {women.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6"
        >
          <Button
            size="lg"
            className="w-14 h-14 rounded-full shadow-lg shadow-primary/30"
            onClick={() => setShowAddDate(true)}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      {/* Modals */}
      <AddContactModal
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        onAdd={handleAddWoman}
      />

      <AddDateModal
        isOpen={showAddDate}
        onClose={() => setShowAddDate(false)}
        onAdd={handleAddDate}
        women={women}
      />

      <ContactDetail
        woman={selectedWoman}
        dates={dates}
        isOpen={!!selectedWoman}
        onClose={() => setSelectedWoman(null)}
        onDelete={handleDeleteWoman}
        onDeleteDate={handleDeleteDate}
      />
    </div>
  );
};

export default Index;
