
// Helper function to get colors for different terpenes
export const getTerpeneColor = (terpene: string): string => {
  const colors: Record<string, string> = {
    'Myrcen': '#3a9a40',
    'Limonen': '#ffbb00',
    'Limonene': '#ffbb00',
    'Caryophyllen': '#ff5733',
    'Caryophyllene': '#ff5733',
    'Pinen': '#00a86b',
    'Pinene': '#00a86b',
    'Linalool': '#8a2be2',
    'Terpinolen': '#4682b4',
    'Terpinolene': '#4682b4',
    'Ocimen': '#ff4500',
    'Ocimene': '#ff4500',
    'Humulen': '#a0522d',
    'Humulene': '#a0522d',
    'Bisabolol': '#d8bfd8'
  };
  
  return colors[terpene] || '#' + Math.floor(Math.random()*16777215).toString(16);
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
