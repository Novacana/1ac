
import React from "react";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  title: string;
  features: Feature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ title, features }) => {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 animate-slide-up">
          {title}
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
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
