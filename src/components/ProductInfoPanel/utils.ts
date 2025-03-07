// Helper function to get colors for different terpenes
export const getTerpeneColor = (terpene: string): string => {
  const colors: Record<string, string> = {
    'Myrcen': '#4ade80', // Vibrant green
    'Limonen': '#facc15', // Bright yellow
    'Limonene': '#facc15', // Bright yellow
    'Caryophyllen': '#f97316', // Vivid orange
    'Caryophyllene': '#f97316', // Vivid orange
    'Pinen': '#10b981', // Emerald green
    'Pinene': '#10b981', // Emerald green
    'Linalool': '#a855f7', // Rich purple
    'Terpinolen': '#3b82f6', // Royal blue
    'Terpinolene': '#3b82f6', // Royal blue
    'Ocimen': '#f43f5e', // Rose red
    'Ocimene': '#f43f5e', // Rose red
    'Humulen': '#b45309', // Deep amber
    'Humulene': '#b45309', // Deep amber
    'Bisabolol': '#d8b4fe', // Soft lavender
    'Nerolidol': '#c084fc', // Light purple
    'Terpineol': '#4ade80', // Vibrant green
    'Eucalyptol': '#67e8f9', // Light cyan
    'Fenchol': '#a3e635', // Lime green
    'Borneol': '#94a3b8', // Slate gray
    'Campher': '#fbbf24', // Amber
    'Camphor': '#fbbf24', // Amber
    'Geraniol': '#fb7185', // Pink
    'Valencen': '#fb923c', // Light orange
    'Valencene': '#fb923c', // Light orange
  };
  
  // If the terpene isn't in our map, generate a consistent color based on the name
  if (!colors[terpene]) {
    // Generate a deterministic hash from the terpene name
    let hash = 0;
    for (let i = 0; i < terpene.length; i++) {
      hash = terpene.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert the hash to a hex color
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  }
  
  return colors[terpene];
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
