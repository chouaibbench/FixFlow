import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wrench, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { motion } from 'motion/react';

export const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'worker' ? '/worker/dashboard' : '/technician/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = (role) => {
    login(role);
    const redirectPath = role === 'worker' ? '/worker/dashboard' : '/technician/dashboard';
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950 transition-colors duration-300">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40">
            <Wrench className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">FixFlow</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Smart Maintenance Management System</p>
        </div>
        <div className="grid gap-6">
          <Card className="group relative overflow-hidden border-2 border-transparent transition-all hover:border-indigo-500/50 hover:shadow-xl dark:bg-slate-900">
            <button onClick={() => handleLogin('worker')} className="flex w-full flex-col items-start p-6 text-left focus:outline-none">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <User className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">Worker Portal</CardTitle>
              <CardDescription className="mt-1">Report machine issues, scan QR codes, and track your reports.</CardDescription>
              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                Continue as Worker <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </Card>
          <Card className="group relative overflow-hidden border-2 border-transparent transition-all hover:border-indigo-500/50 hover:shadow-xl dark:bg-slate-900">
            <button onClick={() => handleLogin('technician')} className="flex w-full flex-col items-start p-6 text-left focus:outline-none">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">Technician Dashboard</CardTitle>
              <CardDescription className="mt-1">Manage tickets, assign tasks, and monitor factory health.</CardDescription>
              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400">
                Continue as Technician <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </Card>
        </div>
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          By continuing, you agree to our <a href="#" className="underline hover:text-indigo-600">Terms of Service</a> and <a href="#" className="underline hover:text-indigo-600">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
};
