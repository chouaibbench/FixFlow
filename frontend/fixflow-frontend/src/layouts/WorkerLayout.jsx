import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { Wrench, LogOut, Bell } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const WorkerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, toggleLang, lang } = useLanguage();


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/worker/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Wrench className="h-6 w-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight">FixFlow</h1>
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Worker Portal</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleLang} className="px-2 py-1 text-xs font-bold rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              {lang === 'en' ? 'ع' : 'EN'}
            </button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
            </Button>
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold">{user?.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role}</p>
              </div>
              <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} fallback="W" className="h-9 w-9 border-2 border-indigo-500/20" />
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-5 w-5 text-slate-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6 lg:px-8">
          <NavLink to="/worker/dashboard" className={({ isActive }) => `px-4 py-3 text-sm font-medium border-b-2 ${isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-indigo-600 dark:text-slate-400'}`}>{t('dashboard')}</NavLink>
          <NavLink to="/worker/tickets" className={({ isActive }) => `px-4 py-3 text-sm font-medium border-b-2 ${isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-indigo-600 dark:text-slate-400'}`}>{t('myTickets')}</NavLink>
          <NavLink to="/worker/machines" className={({ isActive }) => `px-4 py-3 text-sm font-medium border-b-2 ${isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-indigo-600 dark:text-slate-400'}`}>{t('machines')}</NavLink>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-bold">FixFlow</span>
            </div>
            <p className="text-xs text-slate-500">© 2024 FixFlow Maintenance Systems. Worker Portal.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
