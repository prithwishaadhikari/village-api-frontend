import { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, Copy, LogOut, Database, Globe, Shield, ArrowLeft } from 'lucide-react';

interface Village {
  value: string;
  label: string;
  fullAddress: string;
  hierarchy: {
    village: string;
    subDistrict: string;
    district: string;
    state: string;
    country: string;
  };
}

const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="text-indigo-600 font-bold underline underline-offset-2 decoration-2 decoration-indigo-100">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Village[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  const API_BASE_URL = "https://village-api-backend-ofpz.onrender.com/v1";
  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_SECRET = import.meta.env.VITE_API_SECRET;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@villageapi.com" && password === "admin2026") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Use: admin@villageapi.com / admin2026");
    }
  };

  const handleSearch = async (query: string) => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/autocomplete?q=${query}`, {
        headers: { 'X-API-Key': API_KEY, 'X-API-Secret': API_SECRET }
      });
      const data = await response.json();
      if (data.success) setResults(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 1) {
        handleSearch(searchTerm);
      } else {
        setResults([]);
        setSelectedVillage(null); // Clears details if search is empty
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4">
        <div className="max-w-[400px] w-full bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 p-10 border border-slate-100">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
              <Database className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Rural Data Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Authorized access only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" required placeholder="Email Address" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="Password" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
            {authError && <p className="text-red-500 text-[10px] text-center font-bold tracking-wide">{authError}</p>}
            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98]">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Village Data <span className="text-indigo-600">Console</span></h2>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 text-slate-500 hover:text-slate-900 font-bold text-xs flex items-center gap-2 transition-colors">
          <LogOut className="w-4 h-4" /> SIGN OUT
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        <aside className="md:col-span-4 hidden md:block">
          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm sticky top-28">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" /> API Identity
            </h3>
            <div className="space-y-6">
              <div className="group cursor-pointer" onClick={() => {navigator.clipboard.writeText(API_KEY); alert('API Key Copied')}}>
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Public Key</p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center group-hover:border-indigo-200 transition-all overflow-hidden">
                  <code className="text-[10px] text-slate-600 truncate mr-2">{API_KEY}</code>
                  <Copy className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                </div>
              </div>
              <div className="opacity-50">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Secret Token</p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center font-mono italic">
                  <code className="text-[10px] text-slate-400">ENCRYPTED</code>
                  <Copy className="w-3.5 h-3.5 text-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="md:col-span-8 space-y-6">
          {/* SEARCH BAR - Fixed Icon Positioning */}
          <div className="relative flex items-center">
            <Search className="absolute left-5 w-6 h-6 text-slate-300" />
            <input 
              type="text" 
              placeholder="Search national village directory..." 
              className="w-full pl-14 pr-4 py-5 bg-white border border-slate-200 rounded-3xl text-slate-900 font-medium outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isLoading && <Loader2 className="absolute right-5 w-6 h-6 text-indigo-600 animate-spin" />}
          </div>

          {/* DYNAMIC VIEW: List or Details */}
          <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden min-h-[400px]">
            {selectedVillage ? (
              /* INTEGRATED PROFILE VIEW (No longer floating) */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#0f172a] p-8 md:p-12 text-white">
                  <button 
                    onClick={() => setSelectedVillage(null)}
                    className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Search results
                  </button>
                  
                  <div className="space-y-6">
                    <div>
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-md border border-indigo-500/20"> DATA RECORD</span>
                      <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-4">{selectedVillage.label}</h2>
                      <div className="flex items-center gap-2 mt-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Village ID</span>
                        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 font-mono text-xs text-indigo-400 font-bold tracking-widest leading-none">
                          {selectedVillage.value.split('_').pop()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8 border-t border-white/5">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">State</span>
                        <span className="text-sm font-bold truncate">{selectedVillage.hierarchy.state}</span>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-center">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">District</span>
                        <span className="text-sm font-bold truncate">{selectedVillage.hierarchy.district}</span>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Block</span>
                        <span className="text-sm font-medium italic text-slate-400 truncate">{selectedVillage.hierarchy.subDistrict}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                      <button onClick={() => {navigator.clipboard.writeText(selectedVillage.fullAddress); alert('Copied Address!')}} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3">
                        <Copy className="w-5 h-5" /> COPY ADDRESS
                      </button>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedVillage.fullAddress)}`} target="_blank" rel="noreferrer" className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/5">
                        <MapPin className="w-5 h-5 text-indigo-400" /> GOOGLE MAPS
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* SEARCH RESULTS LIST */
              <div className="max-h-[600px] overflow-y-auto">
                {results.length > 0 ? (
                  results.map((v) => (
                    <div 
                      key={v.value} 
                      onClick={() => setSelectedVillage(v)}
                      className="p-6 flex justify-between items-center cursor-pointer border-b border-slate-50 last:border-none hover:bg-indigo-50/30 transition-colors group"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                          <HighlightText text={v.label} highlight={searchTerm} />
                        </p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight mt-1">
                          {v.hierarchy.district}, {v.hierarchy.state}
                        </p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-[400px] flex flex-col items-center justify-center text-slate-300">
                    <Database className="w-12 h-12 mb-4 opacity-10" />
                    <p className="font-bold uppercase text-[10px] tracking-[0.3em]">Awaiting System Query</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}