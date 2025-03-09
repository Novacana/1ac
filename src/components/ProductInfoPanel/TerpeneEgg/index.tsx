import React, { useState } from "react";
import { Product } from "@/types/product";
import { useTheme } from "@/components/ThemeProvider";
import { parsePercentage } from "../utils";
import TerpeneTotal from "./TerpeneTotal";
import TerpeneVisualization from "./TerpeneVisualization";
import TerpeneLegend from "./TerpeneLegend";

interface TerpeneEggProps {
  product: Product;
}

const TerpeneEgg: React.FC<TerpeneEggProps> = ({ product }) => {
  const [expandedTerpene, setExpandedTerpene] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  if (!product.terpenes || product.terpenes.length === 0) return null;

  // Create terpene data
  const terpeneData = product.terpenes.map((terpene) => ({
    name: terpene.name,
    value: parsePercentage(terpene.percentage),
    effect: getTerpeneEffect(terpene.name),
    detailedEffect: getTerpeneDetailedEffect(terpene.name)
  }));

  const totalPercentage = terpeneData.reduce((total, terpene) => total + terpene.value, 0).toFixed(1);

  const handleTerpeneClick = (terpeneName: string) => {
    setExpandedTerpene(expandedTerpene === terpeneName ? null : terpeneName);
  };

  return (
    <div className="w-full">
      <TerpeneTotal totalPercentage={totalPercentage} />
      
      <div className="flex flex-col md:flex-row gap-3 items-center md:items-start">
        {/* The egg visualization */}
        <TerpeneVisualization 
          terpeneData={terpeneData} 
          expandedTerpene={expandedTerpene} 
          onTerpeneClick={handleTerpeneClick}
          isDark={isDark}
        />
        
        {/* Terpene legends and descriptions */}
        <TerpeneLegend 
          terpeneData={terpeneData} 
          expandedTerpene={expandedTerpene} 
          onTerpeneClick={handleTerpeneClick}
          isDark={isDark}
        />
      </div>
    </div>
  );
};

// These functions are imported from utils.ts but kept here for reference
// They will be moved to a dedicated file in the refactoring
function getTerpeneEffect(terpene: string): string {
  const effects: Record<string, string> = {
    'Myrcen': 'Entspannend, schmerzlindernd, sedierend',
    'Limonen': 'Stimmungsaufhellend, antibakteriell, antioxidativ',
    'Limonene': 'Stimmungsaufhellend, antibakteriell, antioxidativ',
    'Caryophyllen': 'Entzündungshemmend, angstlösend',
    'Caryophyllene': 'Entzündungshemmend, angstlösend',
    'Pinen': 'Konzentrationsfördernd, entzündungshemmend',
    'Pinene': 'Konzentrationsfördernd, entzündungshemmend',
    'Linalool': 'Entspannend, angstlösend, sedierend',
    'Terpinolen': 'Beruhigend, antibakteriell',
    'Terpinolene': 'Beruhigend, antibakteriell',
    'Ocimen': 'Antiviral, entzündungshemmend',
    'Ocimene': 'Antiviral, entzündungshemmend',
    'Humulen': 'Appetithemmend, antibakteriell',
    'Humulene': 'Appetithemmend, antibakteriell',
    'Bisabolol': 'Hautberuhigend, entzündungshemmend',
    'Nerolidol': 'Entspannend, antimikrobiell',
    'Terpineol': 'Beruhigend, antimikrobiell',
    'Eucalyptol': 'Atemwegsreinigend, konzentrationsfördernd',
    'Fenchol': 'Antimikrobiell, antioxidativ',
    'Borneol': 'Schmerzlindernd, antibakteriell',
    'Campher': 'Analgetisch, antioxidativ',
    'Camphor': 'Analgetisch, antioxidativ',
    'Geraniol': 'Antimikrobiell, neuroprotektiv',
    'Valencen': 'Aufheiternd, erfrischend',
    'Valencene': 'Aufheiternd, erfrischend',
  };
  
  return effects[terpene] || 'Unterstützt die Entourage-Wirkung';
}

function getTerpeneDetailedEffect(terpene: string): string {
  const detailedEffects: Record<string, string> = {
    'Myrcen': 'Stark entspannend und schmerzlindernd. Fördert den Schlaf und reduziert Muskelverspannungen. Trägt zum Entourage-Effekt bei und verstärkt die Wirkung anderer Cannabinoide.',
    'Limonen': 'Hebt die Stimmung und reduziert Stress. Bekannt für antibakterielle und antioxidative Eigenschaften. Unterstützt das Immunsystem und kann bei Depressionen helfen.',
    'Limonene': 'Hebt die Stimmung und reduziert Stress. Bekannt für antibakterielle und antioxidative Eigenschaften. Unterstützt das Immunsystem und kann bei Depressionen helfen.',
    'Caryophyllen': 'Einzigartiges Terpen, das direkt an CB2-Rezeptoren bindet. Stark entzündungshemmend, lindert Angstzustände und unterstützt das Immunsystem. Hilfreich bei chronischen Schmerzen.',
    'Caryophyllene': 'Einzigartiges Terpen, das direkt an CB2-Rezeptoren bindet. Stark entzündungshemmend, lindert Angstzustände und unterstützt das Immunsystem. Hilfreich bei chronischen Schmerzen.',
    'Pinen': 'Verbessert die Konzentration, Gedächtnisleistung und Aufmerksamkeit. Wirkt entzündungshemmend und antibakteriell. Hilft bei Atemwegserkrankungen und öffnet die Bronchien.',
    'Pinene': 'Verbessert die Konzentration, Gedächtnisleistung und Aufmerksamkeit. Wirkt entzündungshemmend und antibakteriell. Hilft bei Atemwegserkrankungen und öffnet die Bronchien.',
    'Linalool': 'Stark beruhigend und entspannend. Reduziert Angstzustände, Stress und fördert den Schlaf. Hilft bei der Regulierung des Nervensystems und hat krampflösende Eigenschaften.',
    'Terpinolen': 'Mild beruhigend und schlaffördernd. Hat starke antibakterielle Eigenschaften und wirkt antioxidativ. Kann das Nervensystem beruhigen und Entspannung fördern.',
    'Terpinolene': 'Mild beruhigend und schlaffördernd. Hat starke antibakterielle Eigenschaften und wirkt antioxidativ. Kann das Nervensystem beruhigen und Entspannung fördern.',
    'Ocimen': 'Besitzt antivirale und entzündungshemmende Eigenschaften. Kann schmerzhemmend wirken und unterstützt die allgemeine Gesundheit. Wird in der traditionellen Medizin geschätzt.',
    'Ocimene': 'Besitzt antivirale und entzündungshemmende Eigenschaften. Kann schmerzhemmend wirken und unterstützt die allgemeine Gesundheit. Wird in der traditionellen Medizin geschätzt.',
    'Humulen': 'Natürlicher Appetithemmer. Wirkt entzündungshemmend und antibakteriell. Kann bei Allergien und Entzündungen helfen. Findet sich auch in Hopfen.',
    'Humulene': 'Natürlicher Appetithemmer. Wirkt entzündungshemmend und antibakteriell. Kann bei Allergien und Entzündungen helfen. Findet sich auch in Hopfen.',
    'Bisabolol': 'Starke hautberuhigende und heilende Eigenschaften. Wirkt entzündungshemmend und antibakteriell. Hilft bei Hautirritationen und unterstützt die Hautgesundheit.',
    'Nerolidol': 'Entspannend und leicht sedierend. Hat starke antimikrobielle Eigenschaften. Kann Parasiten bekämpfen und die Hautdurchlässigkeit für Medikamente erhöhen.',
    'Terpineol': 'Beruhigt und entspannt. Hat antimikrobielle und antioxidative Eigenschaften. Kann Schmerzen lindern und das Immunsystem stärken.',
    'Eucalyptol': 'Reinigt die Atemwege und hilft bei Erkältungen. Verbessert die Konzentration und Klarheit. Hat entzündungshemmende und schmerzlindernde Eigenschaften.',
    'Fenchol': 'Wirkt antimikrobiell und antioxidativ. Kann bei der Bekämpfung von freien Radikalen helfen. Unterstützt das Immunsystem und die allgemeine Gesundheit.',
    'Borneol': 'Traditionell in der chinesischen Medizin verwendet. Lindert Schmerzen und wirkt antibakteriell. Kann bei Muskelkater und Entzündungen helfen.',
    'Campher': 'Schmerzlindernd und durchblutungsfördernd. Wirkt kühlend und wärmend zugleich. Hilft bei Entzündungen und verbessert die Hautdurchblutung.',
    'Camphor': 'Schmerzlindernd und durchblutungsfördernd. Wirkt kühlend und wärmend zugleich. Hilft bei Entzündungen und verbessert die Hautdurchblutung.',
    'Geraniol': 'Starke antimikrobielle Eigenschaften. Schützt neuronale Zellen und wirkt neuroprotektiv. Kann auch als natürliches Insektenschutzmittel dienen.',
    'Valencen': 'Aufheiternd, erfrischend',
    'Valencene': 'Aufheiternd, erfrischend',
  };
  
  return detailedEffects[terpene] || 'Dieses Terpen trägt zum Entourage-Effekt bei, indem es mit Cannabinoiden interagiert und deren therapeutische Wirkungen verstärkt. Es unterstützt die Gesamtwirkung der Pflanze und verbessert das therapeutische Potential.';
}

export default TerpeneEgg;
