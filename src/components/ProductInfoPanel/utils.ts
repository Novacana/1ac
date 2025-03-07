
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

// Function to parse percentage values from strings
export const parsePercentage = (value: string | undefined) => {
  if (!value) return 0;
  const match = value.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};

// Function to get appropriate background color for flavor tags
export const getFlavorColor = (flavor: string): string => {
  const colorMap: Record<string, string> = {
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
    'Holzig': '#A0522D',
    'Trauben': '#D3E4FD',
    'Beere': '#FFDEE2',
    'Haze': '#F2FCE2',
    'Dessert': '#FEF7CD',
    'Haschartig': '#A0522D',
    'Kräutrig': '#F2FCE2',
  };
  
  return colorMap[flavor] || '#F2FCE2'; // Default to soft green if no match
};
