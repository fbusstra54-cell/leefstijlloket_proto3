
import React, { useState } from 'react';
import { MealEntry } from '../types';
import { Button } from './Button';
import { Plus, Trash2, Utensils, Flame, Calendar } from 'lucide-react';

interface MealLogbookProps {
  entries: MealEntry[];
  onAdd: (meal: { name: string; description: string; calories: number }) => void;
  onDelete: (id: string) => void;
}

export const MealLogbook: React.FC<MealLogbookProps> = ({ entries, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  
  // Filter for today by default or allow selection (simplified to today/all)
  // For now, let's just group them by date for display
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group entries by date
  const groupedEntries: Record<string, MealEntry[]> = {};
  sortedEntries.forEach(entry => {
    if (!groupedEntries[entry.date]) {
      groupedEntries[entry.date] = [];
    }
    groupedEntries[entry.date].push(entry);
  });

  const dates = Object.keys(groupedEntries);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !calories) return;

    onAdd({
      name,
      description,
      calories: parseInt(calories)
    });

    setName('');
    setDescription('');
    setCalories('');
  };

  const calculateDailyTotal = (entries: MealEntry[]) => {
    return entries.reduce((sum, entry) => sum + entry.calories, 0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center">
          <Utensils className="w-8 h-8 mr-3 text-teal-600" />
          Maaltijd Logboek
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Houd bij wat u eet om inzicht te krijgen in uw energie-inname.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300 sticky top-24">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
               <Plus className="w-5 h-5 mr-2 text-teal-600" />
               Nieuwe Maaltijd
             </h3>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Naam Maaltijd</label>
                 <input 
                   type="text" 
                   required
                   placeholder="Bijv. Havermoutontbijt"
                   className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300 p-2.5 text-sm"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Calorieën (kcal)</label>
                 <input 
                   type="number" 
                   required
                   min="0"
                   placeholder="0"
                   className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300 p-2.5 text-sm"
                   value={calories}
                   onChange={(e) => setCalories(e.target.value)}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Beschrijving (Optioneel)</label>
                 <textarea 
                   rows={3}
                   placeholder="Bijv. Met blauwe bessen en noten"
                   className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300 p-2.5 text-sm"
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                 />
               </div>
               <Button type="submit" className="w-full justify-center">
                 Toevoegen
               </Button>
             </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-6">
          {dates.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Nog geen maaltijden</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Voeg uw eerste maaltijd toe om te beginnen met loggen.
              </p>
            </div>
          ) : (
            dates.map(date => {
              const dayTotal = calculateDailyTotal(groupedEntries[date]);
              return (
                <div key={date} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                   <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                     <div className="flex items-center text-slate-700 dark:text-slate-200 font-medium">
                       <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                       {new Date(date).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                     </div>
                     <div className="flex items-center text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
                       <Flame className="w-4 h-4 mr-1 text-orange-500" />
                       {dayTotal} kcal
                     </div>
                   </div>
                   <div className="divide-y divide-slate-100 dark:divide-slate-700">
                     {groupedEntries[date].map(entry => (
                       <div key={entry.id} className="p-4 flex items-start justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                         <div>
                           <h4 className="font-bold text-slate-900 dark:text-white">{entry.name}</h4>
                           {entry.description && (
                             <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{entry.description}</p>
                           )}
                         </div>
                         <div className="flex items-center space-x-4">
                           <span className="font-medium text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap">
                             {entry.calories} kcal
                           </span>
                           <button 
                             onClick={() => onDelete(entry.id)}
                             className="text-slate-400 hover:text-red-500 transition-colors p-1"
                             title="Verwijderen"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
