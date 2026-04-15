import { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, Copy, LogOut, X, Database } from 'lucide-react';

// Identical Interface for Data Consistency
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
          <span key={i} className="text-emerald-600 font-black underline decoration-emerald-200 decoration-2 underline-offset-2">{part}</span>
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

  // Use the same backend URL as yours
  const API_BASE_URL = "https://village-api-backend-ofpz.onrender.com/v1";
  const API_KEY = import.meta.env.VITE_API_KEY; 
  const API_SECRET = import.meta.env.VITE_API_SECRET;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Unique Credentials for her
    if (email === "prithwisha@ruraldata.in" && password === "village2026") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Credentials: prithwisha@ruraldata.in / village2026");
    }
  };

  const handleExit = () => {
    setIsAuthenticated(false);
    setEmail(""); setPassword(""); setSearchTerm("");
    setResults([]); setSelectedVillage(null);
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
      if (searchTerm.length >= 1) handleSearch(searchTerm);
      else { setResults([]); setIsLoading(false); }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-emerald-100">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="p-4 bg-emerald-600 rounded-2xl mb-4 shadow-lg shadow-emerald-200">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-serif">Gramin Insights</h1>
            <p className="text-slate-500 text-sm italic">Rural Administrative Intelligence Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" required placeholder="Officer Email" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required placeholder="Access Code" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" value={password} onChange={(e) => setPassword(e.target.value)} />
            {authError && <p className="text-red-500 text-xs text-center font-medium">{authError}</p>}
            <button type="submit" className="w-full py-4 bg-emerald-900 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg active:scale-95">Verify & Enter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfc] p-4 md:p-8">
      {/* HEADER - Emerald Theme */}
      <header className="max-w-6xl mx-auto bg-emerald-950 text-white p-6 rounded-t-3xl flex justify-between items-center shadow-xl">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500 rounded-full"><Database className="w-5 h-5 text-white" /></div>
          <h1 className="text-xl font-bold tracking-tight">Gramin <span className="text-emerald-400">Insights</span></h1>
        </div>
        <button onClick={handleExit} className="flex items-center space-x-2 text-emerald-300 hover:text-white transition-colors">
          <LogOut className="w-4 h-4" /><span className="text-sm font-bold uppercase tracking-widest">Logout</span>
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto bg-white border-x border-b border-slate-100 rounded-b-3xl shadow-sm p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* API Credentials Card */}
        <section className="space-y-6">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 border-b pb-2"><Copy className="w-5 h-5 text-emerald-600" /> Secure Gateway</h2>
          <div className="p-6 bg-emerald-50/30 rounded-3xl border border-emerald-100 space-y-4">
            <div>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">Public Authorization Key</p>
              <div className="flex bg-white border border-emerald-100 rounded-xl p-3 items-center justify-between">
                <code className="text-xs text-slate-500 truncate">{API_KEY}</code>
                <Copy className="w-4 h-4 text-emerald-300 cursor-pointer hover:text-emerald-600" onClick={() => navigator.clipboard.writeText(API_KEY)} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">System Secret</p>
              <div className="flex bg-white border border-emerald-100 rounded-xl p-3 items-center justify-between shadow-inner">
                <code className="text-xs text-slate-400 italic font-mono">ENCRYPTED_FIELD</code>
                <Copy className="w-4 h-4 text-emerald-300 cursor-pointer hover:text-emerald-600" onClick={() => navigator.clipboard.writeText(API_SECRET)} />
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="space-y-6">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 border-b pb-2"><Search className="w-5 h-5 text-emerald-600" /> Global Directory</h2>
          <div className="relative">
            <input 
              type="text" placeholder="Locate a village..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all shadow-sm font-medium" 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <Search className="absolute left-4 top-4.5 w-5 h-5 text-emerald-300" />
            {isLoading && <Loader2 className="absolute right-4 top-4.5 w-5 h-5 text-emerald-600 animate-spin" />}
          </div>

          <div className="h-[300px] overflow-y-auto bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-3">
            {results.length > 0 ? (
              results.map((v) => (
                <div key={v.value} onClick={() => setSelectedVillage(v)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedVillage?.value === v.value ? 'border-emerald-500 bg-white shadow-lg' : 'bg-white border-transparent hover:border-emerald-100'}`}>
                  <p className="text-sm font-bold text-slate-900"><HighlightText text={v.label} highlight={searchTerm} /></p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter mt-1">{v.hierarchy.district}, {v.hierarchy.state}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 text-xs font-bold uppercase tracking-widest">Awaiting Input...</div>
            )}
          </div>
        </section>
      </main>

      {/* UNIQUE DATA PROFILE CARD */}
      {selectedVillage && (
        <article className="max-w-6xl mx-auto mt-8 bg-white border-2 border-emerald-50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">Official Census Record</div>
              <h2 className="text-5xl font-black text-slate-900 mb-2">{selectedVillage!.label}</h2>
              <p className="text-slate-400 font-mono text-sm mb-10 tracking-widest">REGISTRATION ID: {selectedVillage!.value.replace('village_id_', '')}</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-emerald-100"></div>
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.4em]">Administrative Path</span>
                  <div className="flex-1 h-px bg-emerald-100"></div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="group flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-900 text-white flex items-center justify-center text-[10px] font-bold">ST</span>
                    <span className="text-sm font-black text-slate-800">{selectedVillage!.hierarchy.state}</span>
                  </div>
                  <span className="text-emerald-200">/</span>
                  <div className="group flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">DT</span>
                    <span className="text-sm font-bold text-slate-700">{selectedVillage!.hierarchy.district}</span>
                  </div>
                  <span className="text-emerald-200">/</span>
                  <div className="group flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">SD</span>
                    <span className="text-sm font-medium text-slate-500 italic">{selectedVillage!.hierarchy.subDistrict}</span>
                  </div>
                </div>
              </div>
            </div>

            <aside className="bg-emerald-50/50 rounded-[2rem] p-8 flex flex-col justify-center gap-4">
              <button onClick={() => { navigator.clipboard.writeText(selectedVillage!.fullAddress); alert("Data Saved!"); }} className="flex items-center justify-center gap-3 w-full py-5 bg-emerald-900 text-white font-black rounded-2xl hover:bg-emerald-800 transition-all active:scale-95 shadow-xl">
                <Copy className="w-5 h-5" /><span>EXPORTS ADDRESS</span>
              </button>
              <a href={`http://googleusercontent.com/maps.google.com/2{encodeURIComponent(selectedVillage!.fullAddress)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-5 bg-white border-2 border-emerald-900 text-emerald-900 font-black rounded-2xl hover:bg-emerald-50 transition-all">
                <MapPin className="w-5 h-5" /><span>GEO-LOCATION</span>
              </a>
            </aside>
          </div>
        </article>
      )}

      <footer className="mt-12 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.5em]">System Developed for Rural Information Access • 2026</p>
      </footer>
    </div>
  );
}