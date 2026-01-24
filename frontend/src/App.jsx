import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Activity, 
  CheckCircle, 
  FileText, 
  Copy, 
  Clipboard, 
  Stethoscope, 
  Brain, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Edit,
  ThumbsUp,
  Bold,
  Italic,
  List,
  AlignLeft,
  Clock
} from 'lucide-react'

function App() {
  const [texto, setTexto] = useState('')
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [toast, setToast] = useState(null)
  const [tempoProcessamento, setTempoProcessamento] = useState(null)
  const [cronometroAoVivo, setCronometroAoVivo] = useState(0)

  useEffect(() => {
    let interval
    if (loading) {
      const inicio = Date.now()
      interval = setInterval(() => {
        setCronometroAoVivo(((Date.now() - inicio) / 1000).toFixed(1))
      }, 100)
    } else {
      setCronometroAoVivo(0)
    }
    return () => clearInterval(interval)
  }, [loading])

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
    setTempoProcessamento(null)
    const inicio = Date.now()

    try {
      const response = await axios.post('http://localhost:8000/api/processar-anamnese/', { texto })
      setResultado(response.data)
      const fim = Date.now()
      const duracao = ((fim - inicio) / 1000).toFixed(2)
      setTempoProcessamento(duracao)
    } catch (err) {
      console.error(err)
      setErro('Erro ao processar anamnese. Verifique se o backend está rodando e o Ollama está ativo.')
    } finally {
      setLoading(false)
    }
  }

  const handleAprovar = async () => {
    try {
      const payload = {
        texto_original: texto,
        texto_melhorado: resultado.texto_melhorado,
        cid_sugerido: resultado.cid_sugerido,
        principais_sintomas: resultado.principais_sintomas
      }
      
      await axios.post('http://localhost:8000/api/salvar-anamnese/', payload)
      showToast('Anamnese aprovada e salva no banco de dados!')
      
      // Limpar estado após salvar
      setTexto('')
      setResultado(null)
      setTempoProcessamento(null)
    } catch (err) {
      console.error(err)
      showToast('Erro ao salvar anamnese.', 'error')
    }
  }

  const handleEditar = () => {
    console.log("Editando anamnese:", resultado)
    showToast('Modo de edição ativado (Simulação)')
  }

  const formatTime = (seconds) => {
    const numSeconds = parseFloat(seconds)
    if (isNaN(numSeconds)) return '0s'
    
    if (numSeconds < 60) {
      return `${numSeconds.toFixed(1)}s`
    }
    
    const minutes = Math.floor(numSeconds / 60)
    const remainingSeconds = Math.floor(numSeconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex overflow-hidden">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-medium transition-all transform animate-fade-in-down flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' : 'bg-blue-600'}`}>
          <CheckCircle className="w-5 h-5" />
          {toast.message}
        </div>
      )}

      {/* Sidebar de Navegação */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-lg shadow-lg shadow-blue-900/50">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">MedAssist AI</h1>
            <p className="text-xs text-slate-500 font-medium">Hospital General v2.0</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-900/50 to-transparent border-l-4 border-blue-500 text-white rounded-r-lg transition-all">
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            <span className="font-medium">Painel Clínico</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-lg transition-colors text-slate-400 group">
            <Users className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span>Pacientes</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-lg transition-colors text-slate-400 group">
            <Calendar className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span>Agenda</span>
          </a>
          <div className="pt-4 mt-4 border-t border-slate-800">
            <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-lg transition-colors text-slate-400 group">
              <Settings className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              <span>Configurações</span>
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full px-4 py-2 hover:bg-slate-800 rounded-lg">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Área Central Principal */}
      <main className="flex-1 md:ml-64 p-8 h-screen overflow-y-auto bg-slate-50">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              Nova Admissão / Anamnese
            </h2>
            <p className="text-slate-500 text-sm mt-1 ml-12">Preencha os dados clínicos para análise assistida por IA.</p>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
               Sistema Online
             </span>
             <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-md cursor-pointer hover:shadow-lg transition-shadow">
               DR
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-180px)]">
          
          {/* Coluna Esquerda: Registro Clínico */}
          <section className="flex flex-col gap-6">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
              <div className="bg-slate-50/50 p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Registro Clínico
                </h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase tracking-wider">Entrada Manual</span>
              </div>
              
              <div className="flex-1 flex flex-col p-5">
                {/* Barra de Ferramentas Simulada */}
                <div className="flex items-center gap-1 mb-2 p-2 bg-slate-50 rounded-lg border border-slate-100 w-fit">
                  <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-all" title="Negrito"><Bold className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-all" title="Itálico"><Italic className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-slate-200 mx-1"></div>
                  <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-all" title="Lista"><List className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-all" title="Alinhar"><AlignLeft className="w-4 h-4" /></button>
                </div>

                <div className="relative flex-1 flex flex-col group">
                  <textarea
                    className="flex-1 w-full p-5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none font-sans text-base leading-relaxed text-slate-700 bg-white placeholder-slate-300 transition-all shadow-inner"
                    placeholder=" "
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    id="anamnese-input"
                  />
                  <label 
                    htmlFor="anamnese-input" 
                    className={`absolute left-4 transition-all duration-200 pointer-events-none text-slate-400
                      ${texto ? '-top-2.5 text-xs bg-white px-2 text-blue-600 font-medium' : 'top-5 text-base'}
                      peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-blue-600 peer-focus:font-medium`}
                  >
                    {texto ? 'Anamnese do Paciente' : 'Digite a queixa principal, histórico e sinais vitais...'}
                  </label>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleProcessar}
                    disabled={loading || !texto.trim()}
                    className={`flex items-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all shadow-lg shadow-blue-500/20
                      ${loading || !texto.trim() 
                        ? 'bg-slate-300 cursor-not-allowed shadow-none grayscale' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0'}`}
                  >
                    {loading ? (
                      <>
                        <Activity className="w-5 h-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        Analisar com IA
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Coluna Direita: Insights de IA */}
          <section className="flex flex-col h-full">
            <div className={`bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col relative overflow-hidden transition-all duration-500 ${loading ? 'border-blue-200 ring-4 ring-blue-50/50' : ''}`}>
              
              <div className="bg-slate-50/50 p-5 border-b border-slate-100 flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  Insights de Inteligência Artificial
                </h3>
                {resultado && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-medium border border-emerald-200">Análise Concluída</span>
                    {tempoProcessamento && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {formatTime(tempoProcessamento)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col relative">
                {loading && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-b-2xl">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4 shadow-lg shadow-blue-500/20"></div>
                  <p className="text-blue-700 font-medium animate-pulse">Gerando insights clínicos...</p>
                  <p className="text-blue-500 text-sm mt-2 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(cronometroAoVivo)}
                  </p>
                </div>
              )}

                {resultado ? (
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                    
                    {/* Card CID-10 */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500 p-5 hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            Hipótese Diagnóstica (CID-10)
                          </span>
                          <div className="text-3xl font-bold text-slate-800 tracking-tight">{resultado.cid_sugerido}</div>
                        </div>
                        <button onClick={() => handleCopy(resultado.cid_sugerido)} className="p-2 bg-slate-50 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors border border-slate-100">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Card Texto Melhorado */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-indigo-500 p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Evolução Técnica Sugerida
                        </span>
                        <button onClick={() => handleCopy(resultado.texto_melhorado)} className="p-2 bg-slate-50 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100">
                          <Clipboard className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap text-justify bg-slate-50 p-4 rounded-lg border border-slate-100 font-medium">
                        {resultado.texto_melhorado}
                      </p>
                    </div>

                    {/* Lista de Sintomas */}
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Sintomas e Sinais Clínicos</span>
                      <div className="flex flex-wrap gap-2">
                        {resultado.principais_sintomas.map((sintoma, idx) => (
                          <span key={idx} className="bg-white text-slate-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 flex items-center gap-1.5 shadow-sm hover:border-blue-300 transition-colors cursor-default">
                            <Activity className="w-3 h-3 text-blue-400" />
                            {sintoma}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="pt-6 mt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                      <button 
                        onClick={handleEditar}
                        className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95"
                      >
                        <Edit className="w-4 h-4" />
                        Editar Manualmente
                      </button>
                      <button 
                        onClick={handleAprovar}
                        className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all active:scale-95 hover:-translate-y-0.5"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Aprovar Sugestão
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200 m-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                      <Brain className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="font-semibold text-slate-600 text-lg">Aguardando dados clínicos</p>
                    <p className="text-sm mt-2 max-w-xs text-center text-slate-500">Preencha o registro clínico ao lado para obter sugestões de CID e terminologia técnica.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
