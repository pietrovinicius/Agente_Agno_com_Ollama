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
      if (!resultado) return

      const payload = {
        texto_original: texto,
        texto_melhorado: resultado.texto_melhorado,
        cid_sugerido: resultado.cid_sugerido,
        principais_sintomas: resultado.principais_sintomas || [],
        tempo_processamento: parseFloat(tempoProcessamento) || 0.0
      }

      console.log('Enviando para salvar:', payload)

      await axios.post('http://localhost:8000/api/salvar-anamnese/', payload)

      // Feedback de sucesso
      const msg = 'Sucesso! Anamnese aprovada e salva no banco de dados.'
      alert(msg)
      showToast(msg)

      // Limpar estado após salvar
      setTexto('')
      setResultado(null)
      setTempoProcessamento(null)
      setCronometroAoVivo(0)
    } catch (err) {
      console.error('Erro detalhado:', err)
      const errorMsg = err.response?.data
        ? `Erro ao salvar: ${JSON.stringify(err.response.data)}`
        : 'Erro de conexão ao salvar anamnese. Verifique o backend.'

      alert(errorMsg)
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

      {/* Sidebar de Navegação (Premium Glass Dark) */}
      <aside className="w-72 glass-dark text-slate-300 hidden md:flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-20 transition-all duration-300">
        <div className="p-8 border-b border-slate-800/50 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2.5 rounded-xl shadow-lg shadow-blue-900/50 ring-1 ring-white/10 relative z-10">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div className="relative z-10">
            <h1 className="text-white font-bold text-xl tracking-tight font-display">MedAssist AI</h1>
            <p className="text-[10px] text-blue-300 font-semibold uppercase tracking-widest mt-0.5">Professional V2.0</p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Principal</p>

          <a href="#" className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-blue-600/20 to-transparent border-l-4 border-blue-500 text-white rounded-r-xl transition-all shadow-lg shadow-blue-900/20 group">
            <LayoutDashboard className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-medium tracking-wide">Painel Clínico</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 hover:text-white rounded-xl transition-all text-slate-400 group relative overflow-hidden">
            <span className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 rounded-xl"></span>
            <Users className="w-5 h-5 group-hover:text-blue-400 transition-colors relative z-10" />
            <span className="relative z-10">Pacientes</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 hover:text-white rounded-xl transition-all text-slate-400 group relative overflow-hidden">
            <span className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 rounded-xl"></span>
            <Calendar className="w-5 h-5 group-hover:text-blue-400 transition-colors relative z-10" />
            <span className="relative z-10">Agenda</span>
          </a>

          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-8 mb-4">Sistema</p>

          <a href="#" className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 hover:text-white rounded-xl transition-all text-slate-400 group">
            <Settings className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span>Configurações</span>
          </a>
        </nav>

        <div className="p-6 border-t border-slate-800/50 bg-slate-900/30">
          <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-all w-full px-4 py-3 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 group">
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-medium">Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Área Central Principal */}
      <main className="flex-1 md:ml-72 p-10 h-screen overflow-y-auto bg-slate-50/50 relative">
        {/* Background Decorativo */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <header className="mb-10 flex justify-between items-end relative z-10 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-200">
                Clínica Geral
              </span>
              <span className="text-slate-400 text-xs font-medium">|</span>
              <span className="text-slate-500 text-xs font-medium">Dr. Pietro da Penha</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3 font-display tracking-tight">
              Nova Admissão
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-emerald-100 shadow-sm shadow-emerald-100/50">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-600">Sistema Operacional</span>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-lg shadow-slate-200 cursor-pointer hover:scale-105 transition-transform ring-2 ring-blue-50">
              DR
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-180px)]">

          {/* Coluna Esquerda: Registro Clínico */}
          <section className="flex flex-col gap-6 relative z-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex-1 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/5">
              <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Registro Clínico</h3>
                    <p className="text-xs text-slate-400 font-medium">Entrada de dados do paciente</p>
                  </div>
                </div>
                <div className="flex bg-slate-100/80 p-1 rounded-lg">
                  <button className="px-3 py-1 bg-white text-xs font-bold text-slate-700 rounded shadow-sm border border-slate-200">Manual</button>
                  <button className="px-3 py-1 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors">Voz</button>
                </div>
              </div>

              <div className="flex-1 flex flex-col p-6">
                {/* Barra de Ferramentas Refinada */}
                <div className="flex items-center gap-1 mb-4 p-1.5 bg-slate-50 rounded-xl border border-slate-100 w-full">
                  <div className="flex gap-0.5">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all" title="Negrito"><Bold className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all" title="Itálico"><Italic className="w-4 h-4" /></button>
                  </div>
                  <div className="w-px h-5 bg-slate-200 mx-1.5"></div>
                  <div className="flex gap-0.5">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all" title="Lista"><List className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all" title="Alinhar"><AlignLeft className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1"></div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-3">Editor de Texto</span>
                </div>

                <div className="relative flex-1 flex flex-col group">
                  <textarea
                    className="flex-1 w-full p-6 border-0 bg-slate-50/30 rounded-xl focus:bg-white focus:ring-0 text-slate-600 text-lg leading-relaxed resize-none transition-all placeholder:text-slate-300 min-h-[300px]"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                  />
                  {!texto && (
                    <div className="absolute top-6 left-6 pointer-events-none">
                      <p className="text-slate-400 text-lg">Paciente relata...</p>
                      <p className="text-slate-300 text-sm mt-1">Descreva sintomas, histórico e sinais vitais.</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-between items-center border-t border-slate-50 pt-6">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${texto.length > 10 ? 'bg-emerald-400' : 'bg-slate-300'}`}></div>
                    {texto.length} caracteres
                  </span>

                  <button
                    onClick={handleProcessar}
                    disabled={loading || !texto.trim()}
                    className={`flex items-center gap-2.5 py-3.5 px-8 rounded-xl font-bold text-white transition-all shadow-xl shadow-blue-500/20 active:scale-95
                      ${loading || !texto.trim()
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:-translate-y-1'}`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processando</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        <span>Analisar Caso</span>
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
