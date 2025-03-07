
// Helper function to get colors for different terpenes
export const getTerpeneColor = (terpene: string): string => {
  const colors: Record<string, string> = {
    'Myrcene': '#3a9a40',
    'Limonene': '#ffbb00',
    'Caryophyllene': '#ff5733',
    'Pinene': '#00a86b',
    'Linalool': '#8a2be2',
    'Terpinolene': '#4682b4',
    'Ocimene': '#ff4500',
    'Humulene': '#a0522d',
    'Bisabolol': '#d8bfd8'
  };
  
  return colors[terpene] || '#' + Math.floor(Math.random()*16777215).toString(16);
};

// Parse percentage values from string (e.g. "22%" -> 22)
export const parsePercentage = (value: string | undefined): number => {
  if (!value) return 0;
  const match = value.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};
