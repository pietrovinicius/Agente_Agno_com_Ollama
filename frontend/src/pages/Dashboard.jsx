import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Activity,
  CheckCircle,
  FileText,
  Copy,
  Clipboard,
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
  Clock,
  ClipboardList
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AnamneseHistory from '../AnamneseHistory'

function Dashboard() {
  const navigate = useNavigate()
  const [texto, setTexto] = useState('')
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [toast, setToast] = useState(null)
  const [tempoProcessamento, setTempoProcessamento] = useState(null)
  const [cronometroAoVivo, setCronometroAoVivo] = useState(0)
  const [abaAtiva, setAbaAtiva] = useState('nova') // 'nova' | 'historico'
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('user_name')
    setUserName(name || 'Médico')

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
      setErro('Erro ao processar anamnese. Verifique sua conexão ou autenticação.')
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

      await axios.post('http://localhost:8000/api/salvar-anamnese/', payload)
      
      const msg = 'Sucesso! Anamnese aprovada e salva.'
      showToast(msg)

      setTexto('')
      setResultado(null)
      setTempoProcessamento(null)
      setCronometroAoVivo(0)
    } catch (err) {
      console.error('Erro ao salvar:', err)
      showToast('Erro ao salvar anamnese.', 'error')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_name')
    navigate('/login')
  }

  const handleEditar = () => {
    showToast('Modo de edição ativado (Simulação)')
  }

  const formatTime = (seconds) => {
    const numSeconds = parseFloat(seconds)
    if (isNaN(numSeconds)) return '0s'
    if (numSeconds < 60) return `${numSeconds.toFixed(1)}s`
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

      {/* Sidebar Navigation */}
      <aside className="w-72 glass-dark text-slate-300 hidden md:flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-20">
        <div className="p-8 border-b border-slate-800/50 flex items-center gap-4 relative overflow-hidden group">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2.5 rounded-xl shadow-lg shadow-blue-900/50 ring-1 ring-white/10">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">MedAssist AI</h1>
            <p className="text-[10px] text-blue-300 font-semibold uppercase tracking-widest mt-0.5">Professional V0.6.0</p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <button 
            onClick={() => setAbaAtiva('nova')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${abaAtiva === 'nova' ? 'bg-gradient-to-r from-blue-600/20 to-transparent border-l-4 border-blue-500 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium tracking-wide">Nova Admissão</span>
          </button>

          <button 
            onClick={() => setAbaAtiva('historico')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${abaAtiva === 'historico' ? 'bg-gradient-to-r from-blue-600/20 to-transparent border-l-4 border-blue-500 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="font-medium tracking-wide">Histórico</span>
          </button>

          <div className="pt-8 mb-4">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sistema</p>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800/50 bg-slate-900/30">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-all w-full px-4 py-3 hover:bg-white/5 rounded-xl hover:border-white/5 group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400" />
            <span className="text-sm font-medium">Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 p-10 h-screen overflow-y-auto bg-slate-50/50 relative">
        <header className="mb-10 flex justify-between items-end relative z-10 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-200">
                Clínica Geral
              </span>
              <span className="text-slate-400 text-xs font-medium">|</span>
              <span className="text-slate-500 text-xs font-medium">Dr. {userName}</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight font-display">
              {abaAtiva === 'nova' ? 'Nova Admissão' : 'Centro de Inteligência'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-emerald-100 shadow-sm shadow-emerald-100/50">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Ativo</span>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-lg shadow-slate-200 cursor-pointer hover:scale-105 transition-all ring-2 ring-blue-50">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {abaAtiva === 'nova' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-180px)]">
            {/* Left Column: Input */}
            <section className="flex flex-col gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex-1 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Registro Clínico</h3>
                      <p className="text-xs text-slate-400 font-medium tracking-wide">Entrada de dados brutos</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col p-6">
                  <div className="flex items-center gap-1 mb-4 p-1.5 bg-slate-50 rounded-xl border border-slate-100 w-full">
                    <div className="flex gap-0.5">
                      <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-all"><Bold className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-all"><Italic className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Medical Editor</span>
                    </div>
                    <div className="flex gap-0.5">
                      <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-all"><List className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="relative flex-1 flex flex-col group">
                    <textarea
                      className="flex-1 w-full p-6 border-0 bg-slate-50/30 rounded-xl focus:bg-white focus:ring-0 text-slate-600 text-lg leading-relaxed resize-none transition-all placeholder:text-slate-300"
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      placeholder="Relato do paciente, queixas e observações clínicas..."
                    />
                  </div>

                  <div className="mt-6 flex justify-between items-center border-t border-slate-50 pt-6">
                    <span className="text-xs text-slate-400 font-medium">
                      {texto.length} caracteres
                    </span>

                    <button
                      onClick={handleProcessar}
                      disabled={loading || !texto.trim()}
                      className={`flex items-center gap-2.5 py-3.5 px-8 rounded-xl font-bold text-white transition-all shadow-xl active:scale-95
                        ${loading || !texto.trim()
                          ? 'bg-slate-200 shadow-none cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:-translate-y-1 shadow-blue-500/20'}`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>IA Analisando...</span>
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5" />
                          <span>Analisar com IA</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Right Column: Insights */}
            <section className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2 tracking-tight">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Insights Estruturados
                </h3>
                {resultado && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(tempoProcessamento)}
                  </span>
                )}
              </div>

              <div className="p-8 flex-1 overflow-y-auto relative">
                {loading && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4 shadow-lg shadow-blue-500/20"></div>
                    <p className="text-blue-700 font-bold tracking-wide">Refinando documento clínico...</p>
                    <p className="text-blue-400 text-xs mt-1 font-mono">{cronometroAoVivo}s</p>
                  </div>
                )}

                {resultado ? (
                  <div className="space-y-8 animate-fade-in">
                    {/* CID-10 Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 border-l-8 border-l-blue-600 p-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Hipótese CID-10</span>
                        <button onClick={() => handleCopy(resultado.cid_sugerido)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-4xl font-black text-slate-900 tracking-tighter">{resultado.cid_sugerido}</div>
                    </div>

                    {/* Technical Output */}
                    <div className="group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sugestão de Documentação Técnica</span>
                        <button onClick={() => handleCopy(resultado.texto_melhorado)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                          <Clipboard className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 text-base leading-relaxed text-justify font-medium">
                        {resultado.texto_melhorado}
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Sinais e Sintomas</span>
                      <div className="flex flex-wrap gap-2">
                        {resultado.principais_sintomas.map((s, i) => (
                          <span key={i} className="bg-blue-50/50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-tight">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-8 border-t border-slate-100 flex gap-4">
                      <button 
                        onClick={handleEditar}
                        className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                      >
                        Ajustar Manualmente
                      </button>
                      <button 
                        onClick={handleAprovar}
                        className="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                      >
                        Aprovar Sugestão
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-40">
                    <Brain className="w-20 h-20 text-slate-200 mb-4" />
                    <p className="font-bold text-slate-400">Aguardando análise clínica</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <AnamneseHistory />
        )}
      </main>
    </div>
  )
}

export default Dashboard
