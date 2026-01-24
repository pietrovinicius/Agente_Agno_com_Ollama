import { useState } from 'react'
import axios from 'axios'
import { Activity, CheckCircle, ArrowRight, FileText, Copy, Clipboard } from 'lucide-react'

function App() {
  const [texto, setTexto] = useState('')
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    showToast('Copiado para a área de transferência!')
  }

  const handleProcessar = async () => {
    if (!texto.trim()) return
    setLoading(true)
    setErro('')
    setResultado(null)
    try {
      const response = await axios.post('http://localhost:8000/api/processar-anamnese/', { texto })
      setResultado(response.data)
    } catch (err) {
      console.error(err)
      setErro('Erro ao processar anamnese. Verifique se o backend está rodando e o Ollama está ativo.')
    } finally {
      setLoading(false)
    }
  }

  const handleSalvar = () => {
    console.log("Anamnese aprovada e salva:", resultado)
    showToast('Anamnese confirmada e salva com sucesso!')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 font-sans">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-medium transition-all transform animate-fade-in-down ${toast.type === 'error' ? 'bg-red-500' : 'bg-teal-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold text-teal-700 flex items-center justify-center gap-3 tracking-tight">
            <Activity className="w-8 h-8" />
            Medical AI Assistant
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium uppercase tracking-wider">Análise Clínica Inteligente & Padronização CID-10</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda: Input */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-700">
              <FileText className="w-5 h-5 text-teal-500" />
              Anamnese Bruta
            </h2>
            <textarea
              className="flex-1 w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none font-mono text-sm leading-relaxed text-slate-600 bg-slate-50 placeholder-slate-400"
              placeholder="Digite ou cole as anotações clínicas aqui..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <div className="mt-6">
              <button
                onClick={handleProcessar}
                disabled={loading || !texto.trim()}
                className={`w-full py-3.5 px-4 rounded-lg font-semibold text-white transition-all transform active:scale-[0.99]
                  ${loading || !texto.trim() 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-teal-500/30'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5 animate-spin" />
                    Processando Análise Clínica...
                  </span>
                ) : 'Processar com Inteligência Artificial'}
              </button>
              {erro && <p className="text-red-500 text-sm mt-3 text-center bg-red-50 p-2 rounded border border-red-100">{erro}</p>}
            </div>
          </div>

          {/* Coluna Direita: Resultado */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-700">
              <CheckCircle className="w-5 h-5 text-teal-500" />
              Resultado Clínico Sugerido
            </h2>
            
            {loading ? (
              <div className="flex-1 flex flex-col gap-4 animate-pulse">
                <div className="h-24 bg-slate-100 rounded-lg w-full"></div>
                <div className="flex-1 bg-slate-100 rounded-lg w-full"></div>
                <div className="h-32 bg-slate-100 rounded-lg w-full"></div>
              </div>
            ) : resultado ? (
              <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Card CID */}
                <div className="bg-teal-50 p-5 rounded-lg border border-teal-100 flex items-center justify-between group">
                  <div>
                    <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wide mb-1">Diagnóstico Sugerido (CID-10)</h3>
                    <p className="text-3xl font-mono font-bold text-teal-700">{resultado.cid_sugerido}</p>
                  </div>
                  <button onClick={() => handleCopy(resultado.cid_sugerido)} className="p-2 text-teal-600 hover:bg-teal-100 rounded-md transition-colors" title="Copiar CID">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>

                {/* Texto Melhorado */}
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex-1 relative group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Redação Técnica</h3>
                    <button onClick={() => handleCopy(resultado.texto_melhorado)} className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-md transition-colors" title="Copiar Texto">
                      <Clipboard className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm text-justify">{resultado.texto_melhorado}</p>
                </div>

                {/* Sintomas */}
                <div className="bg-white p-0 rounded-lg">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Sintomas Identificados</h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.principais_sintomas.map((sintoma, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-xs font-medium border border-slate-200">
                        {sintoma}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botão Salvar */}
                <button
                  onClick={handleSalvar}
                  className="mt-auto w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-md hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Aprovar e Integrar ao Prontuário
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <Activity className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-medium">Aguardando dados para análise...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
