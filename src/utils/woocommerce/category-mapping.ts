
/**
 * Get category mapping between WooCommerce and our app
 */
export const getCategoryMapping = (wooCategory: string): string => {
  const mappings: {[key: string]: string} = {
    // Flowers category mappings
    'flower': 'Flowers',
    'flowers': 'Flowers',
    'cannabis': 'Flowers',
    'cannabis-flower': 'Flowers',
    'blüten': 'Flowers',
    'blueten': 'Flowers',
    'blumen': 'Flowers',
    'hemp flower': 'Flowers',
    'hemp flowers': 'Flowers',
    'hanfblüten': 'Flowers',
    'hanfblueten': 'Flowers',
    'cbd flower': 'Flowers',
    'cbd blüten': 'Flowers',
    'cannabis blüten': 'Flowers',
    
    // Oils category mappings
    'oils': 'Oils',
    'oil': 'Oils',
    'öle': 'Oils',
    'oele': 'Oils',
    'cbd oil': 'Oils',
    'cbd öl': 'Oils',
    'cbd-öl': 'Oils',
    'hanföl': 'Oils',
    'cannabis oil': 'Oils',
    'cannabis-oil': 'Oils',
    'tincture': 'Oils',
    'tinkturen': 'Oils',
    'drops': 'Oils',
    'tropfen': 'Oils',
    
    // Accessories category mappings
    'accessories': 'Accessories',
    'zubehör': 'Accessories',
    'zubehoer': 'Accessories',
    'equipment': 'Accessories',
    'geräte': 'Accessories',
    'devices': 'Accessories',
    'tools': 'Accessories',
    'smoking accessories': 'Accessories',
    'vaping accessories': 'Accessories',
    
    // Edibles category mappings
    'edibles': 'Edibles',
    'edible': 'Edibles',
    'essbar': 'Edibles',
    'essbare': 'Edibles',
    'lebensmittel': 'Edibles',
    'food': 'Edibles',
    'snacks': 'Edibles',
    'gummies': 'Edibles',
    'gummis': 'Edibles',
    'candies': 'Edibles',
    'süßigkeiten': 'Edibles',
    'chocolate': 'Edibles',
    'schokolade': 'Edibles',
    'drinks': 'Edibles',
    'getränke': 'Edibles',
    
    // Topicals category mappings
    'topicals': 'Topicals',
    'topical': 'Topicals',
    'cream': 'Topicals',
    'creme': 'Topicals',
    'salve': 'Topicals',
    'salbe': 'Topicals',
    'lotion': 'Topicals',
    'lotionen': 'Topicals',
    'balm': 'Topicals',
    'balsam': 'Topicals',
    'massage': 'Topicals',
    'skin': 'Topicals',
    'haut': 'Topicals',
    
    // Vapes category mappings
    'vapes': 'Vapes',
    'vape': 'Vapes',
    'vaporizer': 'Vapes',
    'vaporizers': 'Vapes',
    'vaporisator': 'Vapes',
    'vaporisatoren': 'Vapes',
    'cartridges': 'Vapes',
    'cart': 'Vapes',
    'carts': 'Vapes',
    'kartuschen': 'Vapes',
    'e-liquid': 'Vapes',
    'eliquid': 'Vapes',
    'liquid': 'Vapes'
  };
  
  // Try to find a mapping, or return the original if no mapping exists
  const lowerCaseCategory = wooCategory.toLowerCase();
  return mappings[lowerCaseCategory] || wooCategory;
};

/**
 * Try to find the best category match based on keywords in the category name
 */
export const getBestCategoryMatch = (categoryName: string): string | null => {
  const lowerCaseName = categoryName.toLowerCase();
  
  // Define keywords for each category
  const categoryKeywords: {[key: string]: string[]} = {
    'Flowers': ['flower', 'blüte', 'bluete', 'blumen', 'cannabis', 'hemp', 'hanf', 'cbd flower', 'buds', 'knospen'],
    'Oils': ['oil', 'öl', 'oel', 'tincture', 'tinktur', 'extract', 'extrakt', 'drops', 'tropfen'],
    'Edibles': ['edible', 'food', 'essen', 'gummy', 'gummies', 'chocolate', 'candy', 'drink', 'getränk'],
    'Topicals': ['topical', 'cream', 'creme', 'balm', 'salve', 'salbe', 'lotion', 'skin', 'haut'],
    'Vapes': ['vape', 'vapor', 'vaporizer', 'cartridge', 'cart', 'liquid', 'e-liquid'],
    'Accessories': ['accessory', 'zubehör', 'device', 'tool', 'equipment', 'grinder', 'pipe', 'bong']
  };
  
  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerCaseName.includes(keyword)) {
        return category;
      }
    }
  }
  
  return null;
};
