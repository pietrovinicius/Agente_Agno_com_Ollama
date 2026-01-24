import { useState } from 'react'
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
  ThumbsUp
} from 'lucide-react'

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

  const handleAprovar = () => {
    console.log("Anamnese aprovada e salva:", resultado)
    showToast('Anamnese aprovada e integrada ao prontuário!')
  }

  const handleEditar = () => {
    console.log("Editando anamnese:", resultado)
    showToast('Modo de edição ativado (Simulação)')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans flex overflow-hidden">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-medium transition-all transform animate-fade-in-down flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' : 'bg-sky-600'}`}>
          <CheckCircle className="w-5 h-5" />
          {toast.message}
        </div>
      )}

      {/* Sidebar de Navegação */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-sky-600 p-2 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">MedAssist AI</h1>
            <p className="text-xs text-slate-500">Hospital General v2.0</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-white rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5 text-sky-500" />
            <span className="font-medium">Painel Clínico</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-lg transition-colors text-slate-400">
            <Users className="w-5 h-5" />
            <span>Pacientes</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-lg transition-colors text-slate-400">
            <Calendar className="w-5 h-5" />
            <span>Agenda</span>
          </a>
          <div className="pt-4 mt-4 border-t border-slate-800">
            <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-lg transition-colors text-slate-400">
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full px-4 py-2">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Área Central Principal */}
      <main className="flex-1 md:ml-64 p-8 h-screen overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-sky-600" />
              Nova Admissão / Anamnese
            </h2>
            <p className="text-slate-500 text-sm mt-1">Preencha os dados clínicos para análise assistida por IA.</p>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               Sistema Online
             </span>
             <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold border-2 border-white shadow-sm">
               DR
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-180px)]">
          
          {/* Coluna Esquerda: Registro Clínico */}
          <section className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-600" />
                  Registro Clínico
                </h3>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Entrada Manual</span>
              </div>
              
              <div className="relative flex-1 flex flex-col group">
                <textarea
                  className="flex-1 w-full p-5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none font-sans text-base leading-relaxed text-slate-700 bg-gray-50 placeholder-slate-400 transition-all"
                  placeholder=" "
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  id="anamnese-input"
                />
                <label 
                  htmlFor="anamnese-input" 
                  className={`absolute left-4 transition-all duration-200 pointer-events-none text-slate-400
                    ${texto ? '-top-2.5 text-xs bg-white px-2 text-sky-600 font-medium' : 'top-5 text-base'}
                    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-sky-600 peer-focus:font-medium`}
                >
                  {texto ? 'Anamnese do Paciente' : 'Digite a queixa principal, histórico e sinais vitais...'}
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleProcessar}
                  disabled={loading || !texto.trim()}
                  className={`flex items-center gap-2 py-3 px-6 rounded-lg font-semibold text-white transition-all shadow-md
                    ${loading || !texto.trim() 
                      ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                      : 'bg-sky-600 hover:bg-sky-700 hover:shadow-sky-500/25 active:scale-95'}`}
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
          </section>

          {/* Coluna Direita: Insights de IA */}
          <section className="flex flex-col h-full">
            <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col relative overflow-hidden transition-all duration-500 ${loading ? 'border-sky-200 ring-4 ring-sky-50/50' : ''}`}>
              
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-sky-700 font-medium animate-pulse">Gerando insights clínicos...</p>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-sky-600" />
                  Insights de Inteligência Artificial
                </h3>
                {resultado && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium">Análise Concluída</span>}
              </div>

              {resultado ? (
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                  
                  {/* Card CID-10 */}
                  <div className="bg-white rounded-xl border border-slate-100 shadow-sm border-l-4 border-l-sky-500 p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1 block">Hipótese Diagnóstica (CID-10)</span>
                        <div className="text-2xl font-bold text-slate-800">{resultado.cid_sugerido}</div>
                      </div>
                      <button onClick={() => handleCopy(resultado.cid_sugerido)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-sky-600 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Texto Melhorado */}
                  <div className="bg-white rounded-xl border border-slate-100 shadow-sm border-l-4 border-l-indigo-500 p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Evolução Técnica Sugerida</span>
                      <button onClick={() => handleCopy(resultado.texto_melhorado)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                        <Clipboard className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap text-justify bg-slate-50 p-4 rounded-lg border border-slate-100">
                      {resultado.texto_melhorado}
                    </p>
                  </div>

                  {/* Lista de Sintomas */}
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Sintomas e Sinais Clínicos</span>
                    <div className="flex flex-wrap gap-2">
                      {resultado.principais_sintomas.map((sintoma, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 flex items-center gap-1">
                          <Activity className="w-3 h-3 text-slate-400" />
                          {sintoma}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="pt-6 mt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleEditar}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sky-700 border border-sky-200 hover:bg-sky-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Editar Manualmente
                    </button>
                    <button 
                      onClick={handleAprovar}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm hover:shadow-emerald-500/20 transition-all"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Aprovar Sugestão
                    </button>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200 m-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="font-medium text-slate-500">Aguardando dados clínicos</p>
                  <p className="text-sm mt-1 max-w-xs text-center">Preencha o registro clínico ao lado para obter sugestões de CID e terminologia técnica.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
