
import React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

const MobileThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
        "bg-background/70 text-foreground shadow-sm"
      )}
      aria-label={theme === "dark" ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
    >
      {theme === "dark" ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
};

export default MobileThemeToggle;
