
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={theme === "dark" ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
      aria-label={theme === "dark" ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}
      <span className="sr-only">
        {theme === "dark" ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
      </span>
    </Button>
  );
}
