'use client';

/**
 * Authentication Page
 * Handles both login and registration
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { UserLogin, UserCreate } from '@/types/api';
import { UserRole } from '@/types/api';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, isAuthenticated, user } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.VIEWER);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  // Check for registration success message
  useEffect(() => {
    try {
      const registered = searchParams?.get('registered');
      if (registered === 'true') {
        setSuccess('Registration successful! Please login.');
        setMode('login');
      }
    } catch (error) {
      // searchParams might not be available in all contexts
      console.warn('Could not read search params:', error);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login.mutateAsync({ email, password });
      // Redirect will happen automatically via AuthContext
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.data?.detail || err?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password || !name) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      await register.mutateAsync({ email, password, name, role });
      setSuccess('Registration successful! Please login.');
      setMode('login');
      // Clear form
      setName('');
      setPassword('');
    } catch (err: any) {
      setError(err?.data?.detail || err?.message || 'Registration failed. Please try again.');
    }
  };

  const isLoading = login.isPending || register.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-3">
          <p className="text-xs uppercase text-indigo-600">DocuPilot</p>
          <h1 className="text-3xl font-semibold text-slate-900">
            {mode === 'login' ? 'Sign in to your workspace' : 'Create your account'}
          </h1>
          <p className="text-sm text-slate-600">
            AI-driven documentation: generate, audit, and maintain with agents.
          </p>
          <div className="grid grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              Auto-generate docs
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              Version tracking
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              Embeddings search
            </div>
          </div>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">
              {mode === 'login' ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === 'login'
                ? 'Use your credentials to login'
                : 'Create an account to get started'}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form
            className="mt-4 space-y-4"
            onSubmit={mode === 'login' ? handleLogin : handleRegister}
          >
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300"
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300"
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300"
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>

            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-300"
                  disabled={isLoading}
                >
                  <option value={UserRole.VIEWER}>Viewer</option>
                  <option value={UserRole.DEVELOPER}>Developer</option>
                  <option value={UserRole.TECHNICAL_WRITER}>Technical Writer</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
                setSuccess(null);
              }}
              className="text-sm text-indigo-600 hover:text-indigo-700"
              disabled={isLoading}
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
