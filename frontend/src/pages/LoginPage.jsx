import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_name', response.data.name || response.data.username);
      
      // Configura o header padrão para futuras requisições
      axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.erro || 'Falha na autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-6">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">MedAssist AI</h1>
          <p className="text-slate-500 font-medium tracking-wide uppercase text-[10px] tracking-[0.2em]">Medical Intelligence System</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/50">
          <h2 className="text-xl font-bold text-slate-800 mb-8 text-center">Acesse sua conta</h2>

          {erro && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{erro}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Usuário</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium outline-none"
                  placeholder="Seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar no Sistema</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center font-medium">
            <span className="text-slate-400 text-sm">Ainda não tem acesso? </span>
            <Link to="/register" className="text-blue-600 text-sm hover:underline decoration-2 underline-offset-4">
              Cadastre-se
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Ambiente Seguro & Criptografado
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
