
import React from "react";
import { 
  BrainCircuit, 
  Zap, 
  Moon, 
  Smile, 
  Brain, 
  Coffee,
  HeartPulse,
  BedDouble
} from "lucide-react";

interface ProductEffectsProps {
  effects?: string[];
}

// Function to get appropriate icon for each effect
const getEffectIcon = (effect: string) => {
  switch (effect) {
    case "Euphorie":
    case "Euphoria":
    case "Mild euphorisch":
      return <Smile className="h-4 w-4" />;
    case "Entspannung":
    case "Tiefe Entspannung":
    case "Relaxed":
    case "Relaxation":
      return <HeartPulse className="h-4 w-4" />;
    case "Energiesteigernd":
    case "Energetic":
    case "Energized":
      return <Zap className="h-4 w-4" />;
    case "Kreativität":
    case "Creativity":
    case "Creative":
    case "Kreativ":
      return <Brain className="h-4 w-4" />;
    case "Fokus":
    case "Focused":
    case "Fokussiert":
    case "Geistig klar":
      return <BrainCircuit className="h-4 w-4" />;
    case "Ausgeglichen":
    case "Balanced":
      return <HeartPulse className="h-4 w-4" />;
    case "Sedierung":
    case "Schläfrigkeit":
    case "Schlaffördernd":
    case "Sleepy":
      return <Moon className="h-4 w-4" />;
    case "Schmerzlinderung":
    case "Pain Relief":
      return <HeartPulse className="h-4 w-4" />;
    default:
      return <Coffee className="h-4 w-4" />; // Default icon
  }
};

const ProductEffects: React.FC<ProductEffectsProps> = ({ effects }) => {
  if (!effects?.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Wirkungen</h3>
      <div className="flex flex-wrap gap-2">
        {effects.map((effect, index) => {
          const icon = getEffectIcon(effect);
          return (
            <div
              key={index}
              className="bg-secondary text-secondary-foreground flex items-center gap-1.5 text-xs px-3 py-1 rounded-full animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
              title={effect} // Add title for hover tooltip
            >
              {icon}
              <span>{effect}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductEffects;
