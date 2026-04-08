import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, Lock, User, AlertCircle, Loader2, UserPlus, ChevronLeft } from 'lucide-react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/register/', {
        username,
        password,
        name
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_name', response.data.name || response.data.username);
      
      axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.erro || 'Falha ao criar conta. Tente outro usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/login" className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-blue-600 transition-colors border border-slate-100">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Crie sua conta</h1>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Novo acesso médico</h2>
              <p className="text-sm text-slate-500">Preencha os dados abaixo</p>
            </div>
          </div>

          {erro && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm animate-shake">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{erro}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
              <input
                type="text"
                required
                className="block w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium outline-none"
                placeholder="Ex: Dr. Roberto Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Usuário de Acesso</label>
              <input
                type="text"
                required
                className="block w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium outline-none"
                placeholder="Ex: roberto.silva"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Senha Segura</label>
              <input
                type="password"
                required
                className="block w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Criando Acesso...</span>
                </>
              ) : (
                <span>Finalizar Cadastro</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center font-medium">
            <span className="text-slate-400 text-sm">Já possui uma conta? </span>
            <Link to="/login" className="text-blue-600 text-sm hover:underline decoration-2 underline-offset-4">
              Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
