import React, { useState } from 'react';
import { fibroRecipes, Recipe } from './mealData';
import { Flame, Star, CheckCircle2, Clock, Leaf, Info, ChefHat, Search, ArrowLeft, Heart, Zap } from 'lucide-react';

interface MealPlanProps {
  onNavigateToCoach: (prompt: string) => void;
}

const MealPlan: React.FC<MealPlanProps> = ({ onNavigateToCoach }) => {
  const [activeCategory, setActiveCategory] = useState<'Tutte' | 'Colazione' | 'Pranzo' | 'Cena' | 'Snack'>('Tutte');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const categories: ('Tutte' | 'Colazione' | 'Pranzo' | 'Cena' | 'Snack')[] = ['Tutte', 'Colazione', 'Pranzo', 'Cena', 'Snack'];

  const filteredRecipes = fibroRecipes.filter(r => {
    const matchesCategory = activeCategory === 'Tutte' || r.category === activeCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.ingredients.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (selectedRecipe) {
    return (
      <div className="space-y-6 pb-12 animate-fade-in">
        {/* Recipe Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 to-teal-900 text-white p-6 premium-shadow">
          <ChefHat className="absolute -right-4 -bottom-4 opacity-10" size={120} />
          
          <button
            onClick={() => setSelectedRecipe(null)}
            className="mb-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all backdrop-blur-sm shadow-sm flex-shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-teal-700/50 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              {selectedRecipe.category}
            </span>
            <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
              <Zap size={12} className={selectedRecipe.energyLevel === 'Basso Sforzo' ? 'text-green-300' : 'text-yellow-300'}/>
              {selectedRecipe.energyLevel}
            </span>
          </div>
          
          <h2 className="text-3xl font-bold font-serif mb-2 leading-tight">{selectedRecipe.title}</h2>
          
          <div className="flex items-center gap-6 mt-4 text-sm font-medium text-teal-100">
             <div className="flex items-center gap-1.5"><Clock size={16}/> Prep: {selectedRecipe.prepTime}</div>
             <div className="flex items-center gap-1.5"><Flame size={16}/> Cottura: {selectedRecipe.cookTime}</div>
          </div>
        </div>

        {/* Fibro Tip */}
        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 flex items-start gap-3 shadow-sm">
          <Heart className="text-orange-500 mt-1 flex-shrink-0" size={20}/>
          <div>
             <h3 className="font-bold text-orange-900 text-sm uppercase tracking-wider mb-1">Perché ti fa bene</h3>
             <p className="text-orange-850 text-sm leading-relaxed">{selectedRecipe.fibroTip}</p>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white p-5 rounded-2xl border border-brandPrimary/10 shadow-sm">
          <h3 className="font-bold text-lg text-brandPrimaryDark flex items-center gap-2 mb-4">
            <Leaf size={20} className="text-brandPrimary"/> Ingredienti
          </h3>
          <ul className="space-y-3">
            {selectedRecipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-start gap-3 text-textPrimary">
                 <div className="w-1.5 h-1.5 rounded-full bg-brandPrimary mt-2 flex-shrink-0"></div>
                 <span className="text-[15px]">{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-white p-5 rounded-2xl border border-brandPrimary/10 shadow-sm">
          <h3 className="font-bold text-lg text-brandPrimaryDark flex items-center gap-2 mb-4">
            <CheckCircle2 size={20} className="text-brandPrimary"/> Preparazione Salva-Energia
          </h3>
          <div className="space-y-4">
            {selectedRecipe.instructions.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-brandPrimaryTint text-brandPrimary flex items-center justify-center font-bold font-serif text-sm flex-shrink-0 border border-brandPrimary/20">
                   {idx + 1}
                 </div>
                 <span className="text-[15px] text-textSecondary pt-1 leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => setSelectedRecipe(null)}
          className="w-full text-brandPrimary bg-white border-2 border-brandPrimary font-bold py-4 rounded-xl hover:bg-brandPrimary hover:text-white transition-all shadow-sm"
        >
          Torna al Ricettario
        </button>

      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 fade-in">
      {/* Informational Header */}
      <div className="bg-gradient-to-br from-brandPrimary to-brandAccent text-white p-6 rounded-3xl premium-shadow relative overflow-hidden">
        <Leaf className="absolute -right-4 -bottom-4 opacity-10" size={100} />
        <h2 className="text-3xl font-bold font-serif mb-2">Ricettario RESET FIBRO™</h2>
        <p className="text-white/90 text-sm leading-relaxed mb-4">
          Antinfiammatorio, digeribile e a basso sforzo.
        </p>
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/20">
           <h3 className="font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-1"><Star size={14}/> Regola d'Oro</h3>
           <p className="text-sm font-medium">Usare verdure surgelate, legumi in barattolo o cereali precotti non è una scorciatoia o una colpa. È rispetto per la tua energia limitata.</p>
        </div>
      </div>

      {/* S.O.S Cucina Button */}
      <button
        onClick={() => onNavigateToCoach("Coach, oggi ho energia zero ma devo pranzare/cenare. Cosa mi preparo in 5 minuti che non richieda sforzo fisico?")}
        className="w-full bg-orange-100 text-orange-800 border border-orange-200 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group"
      >
        <div className="flex items-center gap-3">
           <div className="bg-orange-500 text-white p-2 rounded-xl">
             <Flame size={20}/>
           </div>
           <div className="text-left">
             <h3 className="font-bold">S.O.S Cucina (Energia Zero)</h3>
             <p className="text-xs opacity-80">Chiedi un consiglio rapido al Coach</p>
           </div>
        </div>
        <ChevronRightIcon />
      </button>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca ricetta o ingrediente (es. 'Zucca', 'Avocado')"
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-brandPrimary/20 bg-white shadow-sm text-sm focus:border-brandPrimary focus:ring-1 focus:ring-brandPrimary outline-none transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brandPrimary/50" size={18}/>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === cat ? 'bg-brandPrimary text-white shadow-md' : 'bg-white text-textSecondary border border-brandPrimary/10 hover:bg-brandPrimaryTint'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe, i) => (
            <button
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-white p-5 rounded-2xl border border-brandPrimary/10 shadow-sm hover:shadow-md hover:border-brandPrimary/30 transition-all text-left flex items-start gap-4 group fade-in"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="w-14 h-14 bg-brandPrimaryTint rounded-2xl text-brandPrimary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <ChefHat size={24}/>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {recipe.category}
                  </span>
                  {recipe.energyLevel === 'Basso Sforzo' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <Zap size={10}/> Veloce
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-textPrimary text-[15px] leading-snug group-hover:text-brandPrimary transition-colors mb-1">
                  {recipe.title}
                </h3>
                <p className="text-xs text-textSecondary font-medium flex items-center gap-1 opacity-80">
                  <Clock size={12}/> {recipe.prepTime} prep • {recipe.cookTime} cottura
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-brandPrimary/30">
            <p className="text-textSecondary">Nessuna ricetta trovata con "{searchTerm}"</p>
          </div>
        )}
      </div>

    </div>
  );
};

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brandPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default MealPlan;
