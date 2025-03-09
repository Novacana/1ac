
// Helper function to get colors for different terpenes (individual colors for each)
export const getTerpeneColor = (terpene: string): string => {
  const colors: Record<string, string> = {
    'Myrcen': '#E8F5E9',     // Light green
    'Limonen': '#FFF8E1',    // Light yellow
    'Limonene': '#FFF8E1',   // Light yellow (English name)
    'Caryophyllen': '#FFE0B2', // Light orange
    'Caryophyllene': '#FFE0B2', // Light orange (English name)
    'Pinen': '#E3F2FD',      // Light blue
    'Pinene': '#E3F2FD',     // Light blue (English name)
    'Linalool': '#F3E5F5',   // Light purple
    'Terpinolen': '#E1F5FE', // Light cyan
    'Terpinolene': '#E1F5FE', // Light cyan (English name)
    'Ocimen': '#FCE4EC',     // Light pink
    'Ocimene': '#FCE4EC',    // Light pink (English name)
    'Humulen': '#FBE9E7',    // Light peach
    'Humulene': '#FBE9E7',   // Light peach (English name)
    'Bisabolol': '#EDE7F6',  // Light lavender
    'Nerolidol': '#E8EAF6',  // Light indigo
    'Terpineol': '#F1F8E9',  // Fresh light green
    'Eucalyptol': '#E0F7FA', // Light teal
    'Fenchol': '#F9FBE7',    // Light lime
    'Borneol': '#FAFAFA',    // Light gray
    'Campher': '#FFF3E0',    // Light amber
    'Camphor': '#FFF3E0',    // Light amber (English name)
    'Geraniol': '#FFEBEE',   // Light red
    'Valencen': '#FFF3E0',   // Light deep orange
    'Valencene': '#FFF3E0',  // Light deep orange (English name)
  };
  
  // If the terpene isn't in our map, generate a consistent color based on the name
  if (!colors[terpene]) {
    // Simple hash function to generate consistent colors for unknown terpenes
    let hash = 0;
    for (let i = 0; i < terpene.length; i++) {
      hash = terpene.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate a light pastel color
    const h = hash % 360;
    return `hsl(${h}, 70%, 92%)`; // High lightness for subtle colors
  }
  
  return colors[terpene];
};

// Function to get terpene effects based on the terpene name
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

// Function to get detailed terpene effects based on the terpene name
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

// Function to parse percentage values from strings
export const parsePercentage = (value: string | undefined) => {
  if (!value) return 0;
  const match = value.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};

// Function to get appropriate background color for flavor tags
export const getFlavorColor = (flavor: string): string => {
  // Light mode colors
  const lightModeColors: Record<string, string> = {
    'Earthy': '#FDE1D3', // Soft Peach
    'Pine': '#F2FCE2',   // Soft Green
    'Sweet': '#FEF7CD',  // Soft Yellow
    'Citrus': '#FEC6A1', // Soft Orange
    'Tropical': '#FEC6A1', // Soft Orange
    'Herbal': '#F2FCE2', // Soft Green
    'Nutty': '#FDE1D3',  // Soft Peach
    'Menthol': '#D3E4FD', // Soft Blue
    'Eucalyptus': '#D3E4FD', // Soft Blue
    'Clean': '#D3E4FD',  // Soft Blue
    'Mango': '#FEC6A1',  // Soft Orange
    'Strawberry': '#FFDEE2', // Soft Pink
    'Watermelon': '#FFDEE2', // Soft Pink
    'Blueberry': '#D3E4FD', // Soft Blue
    'Natural': '#F2FCE2', // Soft Green
    // German flavor names
    'Erdig': '#FDE1D3',
    'Kiefer': '#F2FCE2',
    'Süß': '#FEF7CD',
    'Zitrus': '#FEC6A1',
    'Tropisch': '#FEC6A1',
    'Kräuter': '#F2FCE2',
    'Nussig': '#FDE1D3',
    'Würzig': '#FDE1D3',
    'Holzig': '#E8D8C9', // Light brown for wood
    'Trauben': '#E6E0F8', // Light purple for grapes
    'Beere': '#FFDEE2',
    'Haze': '#EFF8FF',
    'Dessert': '#FEF7CD',
    'Haschartig': '#E8D8C9',
    'Kräutrig': '#F2FCE2',
    'Fruchtig': '#FFE0E0',
  };
  
  // Dark mode colors - more saturated and vibrant for better visibility
  const darkModeColors: Record<string, string> = {
    'Earthy': '#B07863',      // Richer brown
    'Pine': '#7AB356',        // Rich green
    'Sweet': '#DDBB33',       // Rich yellow
    'Citrus': '#F28C38',      // Rich orange
    'Tropical': '#F28C38',    // Rich orange
    'Herbal': '#7AB356',      // Rich green
    'Nutty': '#B07863',       // Richer brown
    'Menthol': '#5594E3',     // Rich blue
    'Eucalyptus': '#5594E3',  // Rich blue
    'Clean': '#5594E3',       // Rich blue
    'Mango': '#F28C38',       // Rich orange
    'Strawberry': '#E86B7E',  // Rich pink
    'Watermelon': '#E86B7E',  // Rich pink
    'Blueberry': '#5594E3',   // Rich blue
    'Natural': '#7AB356',     // Rich green
    // German flavor names
    'Erdig': '#B07863',
    'Kiefer': '#7AB356',
    'Süß': '#DDBB33',
    'Zitrus': '#F28C38',
    'Tropisch': '#F28C38',
    'Kräuter': '#7AB356',
    'Nussig': '#B07863',
    'Würzig': '#B07863',
    'Holzig': '#9A7D63',      // Rich brown for wood
    'Trauben': '#9B6CE8',     // Rich purple for grapes
    'Beere': '#E86B7E',
    'Haze': '#6BADFF',
    'Dessert': '#DDBB33',
    'Haschartig': '#9A7D63',
    'Kräutrig': '#7AB356',
    'Fruchtig': '#E86B7E',
  };
  
  // Determine if we're in dark mode based on document class
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  
  // Get the appropriate color map based on the theme
  const colorMap = isDarkMode ? darkModeColors : lightModeColors;
  
  // Default colors for dark/light mode
  const defaultLightColor = '#F2FCE2'; // Default to soft green in light mode
  const defaultDarkColor = '#7AB356';  // Default to rich green in dark mode
  
  // Get color or use default
  return colorMap[flavor] || (isDarkMode ? defaultDarkColor : defaultLightColor);
};
