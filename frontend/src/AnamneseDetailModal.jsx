import React, { useEffect } from 'react';
import { 
  X, 
  FileText, 
  Calendar, 
  Activity, 
  Clock, 
  User, 
  ClipboardCheck,
  Zap
} from 'lucide-react';

const AnamneseDetailModal = ({ anamnese, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!anamnese) return null;

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden border border-white/20 animate-scale-up">
        
        {/* Header Premium */}
        <header className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Detalhamento da Anamnese</h3>
                <span className="px-3 py-1 bg-slate-800 text-blue-400 rounded-lg text-[10px] font-black tracking-widest border border-slate-700">
                  ID #{anamnese.id}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(anamnese.created_at)}
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  CID-10: <span className="text-blue-600 font-bold">{anamnese.cid_sugerido}</span>
                </span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {anamnese.tempo_processamento}s Lab
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-200 text-slate-400 hover:text-slate-800 rounded-full transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Coluna 1: Relato Original */}
            <div className="flex flex-col h-full group">
              <div className="flex items-center gap-2 mb-4 px-1">
                <div className="p-1.5 bg-slate-100 text-slate-500 rounded-md group-hover:bg-slate-800 group-hover:text-white transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Relato Original do Médico</h4>
              </div>
              <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-100 text-slate-600 leading-relaxed text-base italic shadow-inner">
                {anamnese.texto_original}
              </div>
            </div>

            {/* Coluna 2: Documento Estruturado IA */}
            <div className="flex flex-col h-full group">
              <div className="flex items-center gap-2 mb-4 px-1">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Documento Clínico Estruturado (IA)</h4>
              </div>
              <div className="flex-1 bg-white p-6 rounded-3xl border border-blue-50 text-slate-700 leading-relaxed text-base shadow-sm ring-1 ring-blue-50/50">
                <div className="flex flex-wrap gap-2 mb-6">
                  {anamnese.principais_sintomas && anamnese.principais_sintomas.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100 uppercase">
                      • {s}
                    </span>
                  ))}
                </div>
                <div className="whitespace-pre-wrap font-medium">
                  {anamnese.texto_melhorado}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-slate-50 flex justify-end bg-slate-50/30">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-900 transition-all hover:shadow-xl active:scale-95"
          >
            Fechar Visualização
          </button>
        </footer>

      </div>
    </div>
  );
};

export default AnamneseDetailModal;
