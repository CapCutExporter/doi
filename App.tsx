import React, { useState } from 'react';
import { findDoiForReference } from './services/gemini';
import { SearchResult, HistoryItem } from './types';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryList } from './components/HistoryList';
import { Search, Loader2, BookText, Sparkles, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Need to mock or implement simple ID generator if uuid not available, but user said standard libraries. I'll use simple math.random for simplicity in this generated code without external deps.

// Simple ID generator replacement to avoid external dependency issues in this context
const generateId = () => Math.random().toString(36).substring(2, 9);

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await findDoiForReference(input);
      setResult(data);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: generateId(),
        reference: input,
        doi: data.doi,
        timestamp: Date.now(),
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setInput(item.reference);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const insertExample = () => {
    setInput("Martinez, E. M., Carr, D. T., Mullan, P. C., Rogers, L. E., Howlett-Holley, W. L., McGehee, C. A., ... & Godambe, S. A. (2021). Improving equity of care for patients with limited English proficiency using quality improvement methodology. Pediatric Quality & Safety, 6(6), e486.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10 max-w-2xl">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 rotate-3 transform hover:rotate-6 transition-transform">
            <BookText className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          مستخرج الـ <span className="text-blue-600">DOI</span> الذكي
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          أداة بحثية مدعومة بالذكاء الاصطناعي لاستخراج المعرف الرقمي (DOI) للأوراق البحثية والمراجع العلمية بدقة عالية.
        </p>
      </div>

      {/* Main Search Area */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
        <form onSubmit={handleSearch} className="space-y-4">
          <label htmlFor="reference" className="block text-sm font-semibold text-gray-700 mb-1">
            نص المرجع (Citation)
          </label>
          <div className="relative">
            <textarea
              id="reference"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ضع نص المرجع هنا... مثال: Author, A. A. (Year). Title of article. Title of Journal, volume(issue)..."
              className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-800 text-base shadow-sm dir-ltr text-left"
              dir="ltr"
            />
            {input.length === 0 && (
               <button
               type="button"
               onClick={insertExample}
               className="absolute bottom-4 right-4 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200"
             >
               جرب مثالاً
             </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2
              ${loading || !input.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99]'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                جاري البحث والتحليل...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                استخراج الـ DOI
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-3xl mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Result Display */}
      {result && <ResultDisplay result={result} />}

      {/* History */}
      <HistoryList history={history} onSelect={handleSelectHistory} />
      
      {/* Footer */}
      <footer className="mt-16 text-center text-gray-400 text-sm">
        <p>مدعوم بواسطة Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;