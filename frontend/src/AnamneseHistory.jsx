import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ClipboardList, 
  Calendar, 
  Activity, 
  Clock, 
  ChevronRight, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import AnamneseDetailModal from './AnamneseDetailModal';

const AnamneseHistory = () => {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [selectedAnamnese, setSelectedAnamnese] = useState(null);

  useEffect(() => {
    fetchHistorico();
  }, []);

  const fetchHistorico = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/historico/');
      setHistorico(response.data);
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
      setErro('Não foi possível carregar o histórico de anamneses.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium tracking-wide">Recuperando registros clínicos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex flex-col items-center text-center max-w-sm">
          <AlertCircle className="w-12 h-12 mb-4" />
          <h3 className="font-bold text-lg mb-2">Falha na Requisição</h3>
          <p className="text-sm opacity-80">{erro}</p>
          <button 
            onClick={fetchHistorico}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-0 flex flex-col animate-fade-in relative">
      {/* Modal de Detalhes */}
      {selectedAnamnese && (
        <AnamneseDetailModal 
          anamnese={selectedAnamnese} 
          onClose={() => setSelectedAnamnese(null)} 
        />
      )}

      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <ClipboardList className="w-6 h-6" />
          </div>
          Histórico de Atendimentos
        </h2>
        <p className="text-slate-500 text-sm mt-1 ml-11">Visualize e revise evoluções clínicas salvas anteriormente.</p>
      </header>

      {historico.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="font-bold text-slate-600 text-lg">Nenhum registro encontrado</h3>
          <p className="text-slate-400 text-sm mt-2">As anamneses salvas aparecerão listadas aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 custom-scrollbar pb-10">
          {historico.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedAnamnese(item)}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden cursor-pointer active:scale-[0.99]"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.created_at)}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-black border border-blue-100">
                      ID #{item.id}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-800 mb-2 truncate group-hover:text-blue-600 transition-colors">
                    {item.texto_melhorado.substring(0, 100)}...
                  </h4>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-800 text-white rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-blue-400" />
                      CID: {item.cid_sugerido}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {item.tempo_processamento}s
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAnamnese(item);
                    }}
                    className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:rotate-90 hover:scale-110 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnamneseHistory;
