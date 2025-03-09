
import { Circle, Diamond, Hexagon, Pentagon, Square, Triangle, Octagon } from "lucide-react";
import React from 'react';

// Function to get appropriate shape icon based on terpene name
export const getTerpeneShapeIcon = (terpene: string, size: number) => {
  const shapes = [
    { component: Circle, terpenes: ['Myrcen', 'Limonen', 'Limonene'] },
    { component: Diamond, terpenes: ['Caryophyllen', 'Caryophyllene'] },
    { component: Hexagon, terpenes: ['Pinen', 'Pinene'] },
    { component: Pentagon, terpenes: ['Linalool'] },
    { component: Square, terpenes: ['Terpinolen', 'Terpinolene'] },
    { component: Triangle, terpenes: ['Ocimen', 'Ocimene'] },
    { component: Octagon, terpenes: ['Humulen', 'Humulene'] }
  ];
  
  const shape = shapes.find(s => s.terpenes.includes(terpene));
  const IconComponent = shape ? shape.component : Circle;
  
  return <IconComponent size={size} />;
};

// Map terpenes to their effect zones in the egg
export const getTerpenePosition = (terpene: string) => {
  // Map terpenes to their effects for positioning
  const terpeneEffectMap: Record<string, string> = {
    'Myrcen': 'körperlich entspannend',
    'Limonen': 'ganzheitlich anregend stimulierend',
    'Limonene': 'ganzheitlich anregend stimulierend',
    'Caryophyllen': 'körperlich ausgleichend',
    'Caryophyllene': 'körperlich ausgleichend',
    'Pinen': 'geistig ausgleichend öffnend',
    'Pinene': 'geistig ausgleichend öffnend',
    'Linalool': 'geistig entspannend',
    'Terpinolen': 'ganzheitlich entspannend',
    'Terpinolene': 'ganzheitlich entspannend',
    'Ocimen': 'ganzheitlich anregend',
    'Ocimene': 'ganzheitlich anregend',
    'Humulen': 'körperlich erdend ausgleichend',
    'Humulene': 'körperlich erdend ausgleichend'
  };

  // Get the effect zone for this terpene
  const effectZone = terpeneEffectMap[terpene] || 'ganzheitlich anregend';
  
  // Map effect zones to positions in the egg (angle based)
  const zonePositions: Record<string, number> = {
    'geistig ausgleichend öffnend': 60,
    'geistig entspannend': 30,
    'ganzheitlich entspannend': 330,
    'körperlich entspannend': 300,
    'körperlich erdend ausgleichend': 240,
    'körperlich ausgleichend': 210,
    'ganzheitlich anregend stimulierend': 150,
    'ganzheitlich anregend': 120
  };
  
  // Return the angle for the terpene based on its effect
  return zonePositions[effectZone] || 0;
};

// Export reused functions that were in the original file
export const getTerpeneEffect = (terpene: string): string => {
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
};

export const getTerpeneDetailedEffect = (terpene: string): string => {
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
    'Valencen': 'Stimulierend und aufheiternd. Vermittelt ein Gefühl von Frische und Energie. Weniger erforscht als andere Terpene, zeigt aber vielversprechende Eigenschaften.',
    'Valencene': 'Stimulierend und aufheiternd. Vermittelt ein Gefühl von Frische und Energie. Weniger erforscht als andere Terpene, zeigt aber vielversprechende Eigenschaften.',
  };
  
  return detailedEffects[terpene] || 'Dieses Terpen trägt zum Entourage-Effekt bei, indem es mit Cannabinoiden interagiert und deren therapeutische Wirkungen verstärkt. Es unterstützt die Gesamtwirkung der Pflanze und verbessert das therapeutische Potential.';
};
