import React, { useState } from 'react';

import { signIn } from '../lib/auth';

interface LoginPageProps {
  onAuthenticated: (user: any) => void;
}

const heroImage = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop';

export default function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn(email, password);
      // Ensure user data exists before calling callback
      if (res && res.user) {
        onAuthenticated(res.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err?.response?.data?.error || err?.message || 'Đăng nhập thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0F0F0F] text-white">
      {/* Visual side */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/80" />
        <div className="relative z-10 flex flex-col justify-end p-12 h-full animate-in fade-in slide-in-from-left duration-700">
          <div className="space-y-2">
            <h2 className="font-serif text-4xl tracking-[0.18em] text-white">ARISTINO</h2>
            <p className="uppercase tracking-[0.3em] text-sm text-[#C8A97E] font-semibold">Luxury Fashion</p>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex w-full lg:w-[45%] items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-[radial-gradient(circle_at_30%_20%,rgba(200,169,126,0.12),transparent_60%)] pointer-events-none" />
        <div className="w-full max-w-md space-y-10 relative z-10 animate-in fade-in slide-in-from-right duration-700">
          <div className="lg:hidden font-serif text-[#C8A97E] text-2xl tracking-[0.18em]">ARISTINO</div>

          <header className="space-y-3">
            <h1 className="font-serif text-3xl">Welcome Back</h1>
            <p className="text-gray-400 text-base leading-relaxed">
              Enter your credentials to access the admin dashboard.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[11px] uppercase tracking-[0.25em] text-gray-400 font-semibold"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aristino.com"
                className="w-full bg-transparent border-0 border-b border-white/15 focus:border-[#C8A97E] transition-colors py-3 text-sm placeholder:text-gray-600"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-[11px] uppercase tracking-[0.25em] text-gray-400 font-semibold"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-0 border-b border-white/15 focus:border-[#C8A97E] transition-colors py-3 text-sm placeholder:text-gray-600"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 accent-[#C8A97E] border border-white/20 bg-transparent"
                />
                <span>Keep me signed in</span>
              </label>
              <button type="button" className="text-gray-400 hover:text-[#C8A97E] transition-colors">
                Forgot Password?
              </button>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8A97E] hover:bg-[#b09269] text-black font-bold tracking-[0.08em] py-4 uppercase transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_12px_30px_rgba(200,169,126,0.18)]"
            >
              {loading ? 'Authenticating...' : 'Sign in dashboard'}
            </button>
          </form>

          <div className="text-center text-sm text-gray-400">
            <p>
              Don&apos;t have an account?{' '}
              <span className="text-white hover:text-[#C8A97E] transition-colors">Contact Support</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
