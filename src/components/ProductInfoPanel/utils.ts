
// Helper function to get colors for different terpenes (more subtle palette)
export const getTerpeneColor = (terpene: string): string => {
  const colors: Record<string, string> = {
    'Myrcen': '#F2FCE2', // Soft Green
    'Limonen': '#FEF7CD', // Soft Yellow
    'Limonene': '#FEF7CD', // Soft Yellow
    'Caryophyllen': '#FEC6A1', // Soft Orange
    'Caryophyllene': '#FEC6A1', // Soft Orange
    'Pinen': '#D3E4FD', // Soft Blue
    'Pinene': '#D3E4FD', // Soft Blue
    'Linalool': '#E5DEFF', // Soft Purple
    'Terpinolen': '#D3E4FD', // Soft Blue
    'Terpinolene': '#D3E4FD', // Soft Blue
    'Ocimen': '#FFDEE2', // Soft Pink
    'Ocimene': '#FFDEE2', // Soft Pink
    'Humulen': '#FDE1D3', // Soft Peach
    'Humulene': '#FDE1D3', // Soft Peach
    'Bisabolol': '#E5DEFF', // Soft Lavender
    'Nerolidol': '#E5DEFF', // Soft Purple
    'Terpineol': '#F2FCE2', // Soft Green
    'Eucalyptol': '#D3E4FD', // Soft Cyan
    'Fenchol': '#F2FCE2', // Soft Green
    'Borneol': '#F1F0FB', // Soft Gray
    'Campher': '#FEF7CD', // Soft Amber
    'Camphor': '#FEF7CD', // Soft Amber
    'Geraniol': '#FFDEE2', // Soft Pink
    'Valencen': '#FEC6A1', // Soft Orange
    'Valencene': '#FEC6A1', // Soft Orange
  };
  
  // If the terpene isn't in our map, generate a consistent color based on the name
  if (!colors[terpene]) {
    return '#F1F0FB'; // Default to soft gray for unknown terpenes
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
