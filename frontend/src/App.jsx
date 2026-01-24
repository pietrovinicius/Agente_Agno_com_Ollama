import { useState } from 'react'
import axios from 'axios'
import { Activity, CheckCircle, ArrowRight, FileText } from 'lucide-react'

function App() {
  const [texto, setTexto] = useState('')
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleProcessar = async () => {
    if (!texto.trim()) return
    setLoading(true)
    setErro('')
    try {
      // Ajuste a URL conforme necessário (localhost:8000 para Django)
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
    alert("Anamnese confirmada! (Ver console)")
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-2">
            <Activity className="w-8 h-8" />
            Assistente Clínico Inteligente
          </h1>
          <p className="text-gray-500 mt-2">Processamento de anamnese com Agno & Llama 3.1</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna Esquerda: Input */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              Anamnese Bruta
            </h2>
            <textarea
              className="w-full h-96 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-mono text-sm"
              placeholder="Digite as anotações médicas aqui... (Ex: Paciente reclama de dor de cabeça forte há 3 dias, fotofobia...)"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <div className="mt-4">
              <button
                onClick={handleProcessar}
                disabled={loading || !texto.trim()}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all
                  ${loading || !texto.trim() 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30'}`}
              >
                {loading ? 'Processando com IA...' : 'Processar Anamnese'}
              </button>
              {erro && <p className="text-red-500 text-sm mt-2 text-center">{erro}</p>}
            </div>
          </div>

          {/* Coluna Direita: Resultado */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Sugestão Clínica
            </h2>
            
            {resultado ? (
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-800 uppercase mb-1">CID-10 Sugerido</h3>
                  <p className="text-2xl font-mono font-bold text-blue-600">{resultado.cid_sugerido}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex-1">
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Texto Melhorado</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{resultado.texto_melhorado}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="text-sm font-bold text-green-800 uppercase mb-2">Principais Sintomas</h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.principais_sintomas.map((sintoma, idx) => (
                      <span key={idx} className="bg-white text-green-700 px-3 py-1 rounded-full text-sm border border-green-200 shadow-sm">
                        {sintoma}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSalvar}
                  className="mt-auto w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Confirmar e Salvar
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                <ArrowRight className="w-12 h-12 mb-2 opacity-20" />
                <p>O resultado processado aparecerá aqui</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
