import React, { useState } from 'react';
import { useLogin } from '../../hooks/queries/useAuth';
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const { mutate: login, isPending, error } = useLogin();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(
      { email, password },
      {
        onSuccess: () => {
          navigate('/dashboard')
        }
      }
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white selection:bg-neutral-800">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-black/40 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-neutral-400 text-sm">Enter your email to sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/50 border border-red-900 text-red-400 text-sm">
            {error.response?.data?.error || error.message || 'Login failed'}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-neutral-300" htmlFor="password">Password</label>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 mt-2 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          Don't have an account?{' '}
          <a href="/register" className="text-white font-medium hover:underline underline-offset-4">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
