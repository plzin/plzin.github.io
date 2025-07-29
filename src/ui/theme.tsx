'use client';

import React from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';

/** Returns the theme that is currently active. */
export function getTheme(): string {
  return localStorage.getItem('theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

export function ThemeSwitcher() {
  const [theme, setTheme] = React.useState<string>();

  const updateTheme = (theme: string) => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    setTheme(theme);
  };

  React.useEffect(() => {
    updateTheme(getTheme());
  }, []);

  if (!theme) {
    return null;
  }

  const toggleTheme = () => {
    updateTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const Icon = theme === 'dark' ? HiSun : HiMoon;

  return (
    <Icon onClick={toggleTheme} className="absolute top-4 left-4 text-4xl hover:text-primary" role="button" />
  );
}