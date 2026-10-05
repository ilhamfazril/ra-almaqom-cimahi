/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import HomePage from './app/page';
import AdminLoginPage from './app/admin/login/page';
import AdminDashboardPage from './app/admin/dashboard/page';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    // Support hash or pathname
    const hash = window.location.hash.replace(/^#/, '');
    if (hash && (hash.startsWith('/admin') || hash === '/')) {
      return hash;
    }
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && (hash.startsWith('/admin') || hash === '/')) {
        setCurrentPath(hash);
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      // Also update hash as fallback for iframe environments where pushState might not reflect in URL bar
      window.location.hash = path;
    }
  };

  // Route matching
  if (currentPath === '/admin/login' || currentPath.startsWith('/admin/login')) {
    return <AdminLoginPage onNavigate={navigate} />;
  }

  if (currentPath === '/admin/dashboard' || currentPath.startsWith('/admin/dashboard')) {
    return <AdminDashboardPage onNavigate={navigate} />;
  }

  // Default: Public Landing Page
  return <HomePage onNavigate={navigate} />;
}
