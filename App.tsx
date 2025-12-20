import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DrinkRecord, DrinkType, GemniAnalysisResult } from './types';
import { getStoredDrinks, saveDrink, deleteDrink } from './services/storageService';
import { analyzeDrinkingHabits } from './services/geminiService';
import { QuickAddButton } from './components/QuickAddButton';
import { HistoryItem } from './components/HistoryItem';
import { ConsumptionCharts } from './components/Charts';
import { DRINK_CONFIG } from './constants';
import { LayoutDashboard, History, BarChart3, Sparkles, CalendarDays } from 'lucide-react';

enum ViewState {
  HOME = 'HOME',
  HISTORY = 'HISTORY',
  STATS = 'STATS'
}

function App() {
  const [drinks, setDrinks] = useState<DrinkRecord[]>([]);
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [aiAnalysis, setAiAnalysis] = useState<GemniAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // State for the pop animation: showing the specific emoji of the drink added
  const [addedEmoji, setAddedEmoji] = useState<string | null>(null);

  useEffect(() => {
    setDrinks(getStoredDrinks());
  }, []);

  const handleAddDrink = (type: DrinkType) => {
    const newDrink = saveDrink(type);
    setDrinks(prev => [newDrink, ...prev]);
    
    // Trigger pop animation with the correct emoji
    setAddedEmoji(DRINK_CONFIG[type].emoji);
    setTimeout(() => setAddedEmoji(null), 1500);
  };

  const handleDeleteDrink = (id: string) => {
    if (window.confirm('¿Borrar esta bebida?')) {
      const updated = deleteDrink(id);
      setDrinks(updated);
    }
  };

  const handleAnalysis = useCallback(async () => {
    if (drinks.length === 0) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeDrinkingHabits(drinks);
      setAiAnalysis(result);
    } finally {
      setIsAnalyzing(false);
    }
  }, [drinks]);

  // Group drinks by month for the History view
  const drinksByMonth = useMemo(() => {
    const groups: Record<string, DrinkRecord[]> = {};
    drinks.forEach(drink => {
      const date = new Date(drink.timestamp);
      // Format: "Noviembre 2023"
      const key = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      // Capitalize first letter
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
      
      if (!groups[formattedKey]) groups[formattedKey] = [];
      groups[formattedKey].push(drink);
    });
    return groups;
  }, [drinks]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/30 pb-24 md:pb-10">
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80"></div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥂</span>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              BebidaTracker
            </h1>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-full text-xs font-mono text-zinc-400">
            Total: <span className="text-white font-bold">{drinks.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto p-4 md:p-6 w-full">
        
        {/* VIEW: HOME */}
        {view === ViewState.HOME && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center py-6">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">¿Qué cae hoy?</h2>
              <p className="text-zinc-500">Registra cada trago, la IA te juzgará luego.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <QuickAddButton type={DrinkType.CHUPITO} onClick={handleAddDrink} />
              <QuickAddButton type={DrinkType.CERVEZA} onClick={handleAddDrink} />
              <QuickAddButton type={DrinkType.CUBATA} onClick={handleAddDrink} />
            </div>

            {/* AI Section */}
            <div className="mt-8 bg-zinc-900/30 rounded-3xl p-6 border border-zinc-800/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wide">Barman IA</span>
                </div>
                <button 
                  onClick={handleAnalysis}
                  disabled={isAnalyzing || drinks.length === 0}
                  className="text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-4 py-2 rounded-full transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? 'Pensando...' : 'Júzgame'}
                </button>
              </div>
              
              <div className="relative z-10 min-h-[60px] flex items-center">
                {aiAnalysis ? (
                  <div className={`w-full p-4 rounded-2xl border backdrop-blur-sm ${
                    aiAnalysis.tone === 'warning' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
                    aiAnalysis.tone === 'fun' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-200' :
                    'bg-zinc-800/50 border-zinc-700 text-zinc-300'
                  }`}>
                    <p className="text-lg font-medium leading-relaxed">"{aiAnalysis.message}"</p>
                  </div>
                ) : (
                  <p className="text-zinc-600 text-sm italic w-full text-center">
                    "Bebe un poco y pulsa el botón para recibir sabiduría etílica."
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: HISTORY (Grouped by Month) */}
        {view === ViewState.HISTORY && (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-purple-500" />
              Historial
            </h2>
            
            {drinks.length === 0 ? (
              <EmptyState icon={<History className="w-10 h-10 opacity-20" />} text="Aún no hay fiesta aquí." />
            ) : (
              <div className="space-y-8">
                {Object.entries(drinksByMonth).map(([month, monthDrinks]) => (
                  <div key={month} className="relative">
                    <div className="sticky top-[72px] z-10 bg-black/90 backdrop-blur-md py-2 mb-2 border-b border-zinc-900">
                      <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 uppercase tracking-widest">
                        {month}
                      </h3>
                    </div>
                    <div>
                      {monthDrinks.map(drink => (
                        <HistoryItem key={drink.id} item={drink} onDelete={handleDeleteDrink} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: STATS */}
        {view === ViewState.STATS && (
          <div className="animate-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-cyan-500" />
              Estadísticas
            </h2>
            {drinks.length === 0 ? (
              <EmptyState icon={<BarChart3 className="w-10 h-10 opacity-20" />} text="Sin datos no hay paraíso." />
            ) : (
              <ConsumptionCharts data={drinks} />
            )}
          </div>
        )}

      </main>

      {/* Floating Navigation Bar */}
      <nav className="fixed bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 max-w-sm mx-auto z-40">
        <div className="flex justify-between items-center bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl shadow-black/50">
          <NavButton 
            active={view === ViewState.HOME} 
            onClick={() => setView(ViewState.HOME)} 
            icon={<LayoutDashboard size={22} />} 
          />
          <NavButton 
            active={view === ViewState.HISTORY} 
            onClick={() => setView(ViewState.HISTORY)} 
            icon={<History size={22} />} 
          />
          <NavButton 
            active={view === ViewState.STATS} 
            onClick={() => setView(ViewState.STATS)} 
            icon={<BarChart3 size={22} />} 
          />
        </div>
      </nav>

      {/* Pop Animation Overlay */}
      {addedEmoji && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          <div className="animate-[bounce_1s_infinite] text-[10rem] filter drop-shadow-2xl animate-in zoom-in duration-300 fade-out slide-out-to-top-20">
            {addedEmoji}
          </div>
        </div>
      )}
    </div>
  );
}

const EmptyState = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-zinc-600 gap-4 border border-dashed border-zinc-900 rounded-3xl">
    {icon}
    <p>{text}</p>
  </div>
);

const NavButton = ({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center justify-center w-16 h-12 rounded-full transition-all duration-300
      ${active ? 'bg-zinc-100 text-black scale-100 shadow-lg' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'}
    `}
  >
    {icon}
  </button>
);

export default App;