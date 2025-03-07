
import React from "react";
import { cn } from "@/lib/utils";

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 animate-slide-up">
          Warum 1A Cannabis für medizinisches Cannabis wählen?
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Lizenzierte Ärzte",
              description: "Unsere Produkte werden von lizenzierten Ärzten nach einer gründlichen Beratung verschrieben.",
            },
            {
              title: "Garantierte Qualität",
              description: "Alle Produkte werden im Labor auf Reinheit, Wirksamkeit und Sicherheit getestet.",
            },
            {
              title: "Diskrete Lieferung",
              description: "Ihre Privatsphäre ist wichtig - alle Bestellungen werden in diskreter Verpackung verschickt.",
            },
          ].map((item, index) => (
            <div 
              key={index}
              className={cn(
                "p-6 rounded-xl border border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                "flex flex-col items-center text-center animate-scale-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-xl font-medium mb-3">{item.title}</h3>
              <p className="text-foreground/70">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
