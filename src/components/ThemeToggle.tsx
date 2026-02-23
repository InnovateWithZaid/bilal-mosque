import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-24 right-4 z-50 h-10 w-10 rounded-full bg-card/90 backdrop-blur-sm shadow-lg border border-border/50 flex items-center justify-center text-foreground transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
