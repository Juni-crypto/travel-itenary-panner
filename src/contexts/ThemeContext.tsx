import React from 'react';

export type ThemeMode = 'luxury' | 'backpacking';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
    hover: string;
  };
}

const themeColors = {
  luxury: {
    primary: 'text-gold',
    secondary: 'text-gold-light',
    accent: 'text-gold-dark',
    background: 'bg-black',
    text: 'text-gray-100',
    border: 'border-gold',
    hover: 'hover:bg-gold-light',
  },
  backpacking: {
    primary: 'text-adventure-500',
    secondary: 'text-adventure-400',
    accent: 'text-adventure-600',
    background: 'bg-slate-900',
    text: 'text-gray-100',
    border: 'border-adventure-500',
    hover: 'hover:bg-adventure-400',
  },
};

export const ThemeContext = React.createContext<ThemeContextType>({
  mode: 'luxury',
  toggleMode: () => {},
  colors: themeColors.luxury,
});

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const [mode, setMode] = React.useState<ThemeMode>('luxury');

  const toggleMode = React.useCallback(() => {
    setMode((prevMode) => (prevMode === 'luxury' ? 'backpacking' : 'luxury'));
  }, []);

  const value = React.useMemo(
    () => ({
      mode,
      toggleMode,
      colors: themeColors[mode],
    }),
    [mode, toggleMode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
