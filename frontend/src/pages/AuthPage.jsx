import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Stars, Zap, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const LoginPage = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const { login } = useAuth();
  const { toast } = useToast();

  // Generate floating particles for background animation
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 3 + Math.random() * 4,
          size: 2 + Math.random() * 4
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast({
          title: "¡Bienvenido de vuelta!",
          description: `Hola ${result.user.display_name}, listo para continuar tu racha?`,
        });
      } else {
        toast({
          title: "Error al iniciar sesión",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/25 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-bounce"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
          />
        ))}
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-10 w-4 h-4 border border-white/20 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-20 right-10 w-6 h-6 border border-purple-300/30 rotate-12 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-pink-400/40 rounded-full animate-ping"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with Enhanced Animation */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full mb-6 relative group transition-all duration-500 hover:scale-110 hover:rotate-12">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 animate-slideInLeft">
            ¡Bienvenido de vuelta!
          </h1>
          <p className="text-white text-lg animate-slideInRight">Inicia sesión para continuar tu experiencia adictiva</p>
        </div>

        {/* Enhanced Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 animate-fadeInUp relative overflow-hidden">
          {/* Form Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-3xl blur-xl opacity-50"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative">
            {/* Enhanced Email Field */}
            <div className="group">
              <label className="block text-white text-sm font-medium mb-3 transition-all duration-300 group-hover:text-white">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-white/70 transition-all duration-300 group-hover:text-white group-focus-within:text-white" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent hover:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  placeholder="tu@email.com"
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Enhanced Password Field */}
            <div className="group">
              <label className="block text-white text-sm font-medium mb-3 transition-all duration-300 group-hover:text-white">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-white/70 transition-all duration-300 group-hover:text-white group-focus-within:text-white" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent hover:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-white/70 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {loading ? (
                <div className="flex items-center justify-center relative z-10">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  <span className="animate-pulse">Iniciando sesión...</span>
                </div>
              ) : (
                <span className="relative z-10 flex items-center justify-center">
                  <Zap className="w-5 h-5 mr-2 animate-pulse" />
                  Iniciar Sesión
                </span>
              )}
            </button>
          </form>

          {/* Enhanced Switch to Register */}
          <div className="text-center mt-8 animate-fadeIn">
            <p className="text-gray-300">
              ¿No tienes cuenta?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-purple-300 hover:text-white font-medium transition-all duration-300 hover:underline transform hover:scale-105 inline-block"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>

        {/* Enhanced Features Preview */}
        <div className="mt-10 text-center animate-fadeInUp">
          <p className="text-gray-400 text-sm mb-6">Únete a la experiencia más adictiva:</p>
          <div className="flex justify-center space-x-8">
            <div className="text-center group transform hover:scale-110 transition-all duration-300 cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl flex items-center justify-center mb-3 mx-auto backdrop-blur-sm border border-white/10 group-hover:bg-purple-500/40 transition-all duration-300">
                <span className="text-2xl animate-bounce group-hover:animate-pulse">🏆</span>
              </div>
              <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors duration-300">Logros</span>
            </div>
            <div className="text-center group transform hover:scale-110 transition-all duration-300 cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-r from-pink-500/30 to-red-500/30 rounded-2xl flex items-center justify-center mb-3 mx-auto backdrop-blur-sm border border-white/10 group-hover:bg-pink-500/40 transition-all duration-300">
                <span className="text-2xl animate-bounce group-hover:animate-pulse" style={{animationDelay: '0.2s'}}>💬</span>
              </div>
              <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors duration-300">Chat</span>
            </div>
            <div className="text-center group transform hover:scale-110 transition-all duration-300 cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-2xl flex items-center justify-center mb-3 mx-auto backdrop-blur-sm border border-white/10 group-hover:bg-blue-500/40 transition-all duration-300">
                <span className="text-2xl animate-bounce group-hover:animate-pulse" style={{animationDelay: '0.4s'}}>🔥</span>
              </div>
              <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors duration-300">Rachas</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Hearts Animation */}
      <div className="absolute top-10 left-10 animate-ping">
        <Heart className="w-4 h-4 text-pink-400/60" />
      </div>
      <div className="absolute bottom-20 left-1/4 animate-pulse">
        <Stars className="w-5 h-5 text-purple-400/50" />
      </div>
    </div>
  );
};

const RegisterPage = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    display_name: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        email: formData.email,
        username: formData.username,
        display_name: formData.display_name,
        password: formData.password
      });

      if (result.success) {
        toast({
          title: "¡Bienvenido!",
          description: `${result.user.display_name}, tu cuenta ha sido creada exitosamente`,
        });
      } else {
        toast({
          title: "Error al registrarse",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative">
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">¡Únete ahora!</h1>
          <p className="text-gray-300">Crea tu cuenta y comienza tu aventura adictiva</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Nombre de usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="usuario123"
                  required
                  pattern="[a-zA-Z0-9_]+"
                  title="Solo letras, números y guiones bajos"
                />
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Nombre para mostrar
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tu Nombre"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Creando cuenta...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center mt-6">
            <p className="text-gray-300">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-purple-300 hover:text-white font-medium transition-colors"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginPage onSwitchToRegister={() => setIsLogin(false)} />
  ) : (
    <RegisterPage onSwitchToLogin={() => setIsLogin(true)} />
  );
};

export default AuthPage;