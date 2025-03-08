
import { WooCommerceProduct } from "@/types/woocommerce";
import { Product } from "@/types/product";
import { getCategoryMapping, getBestCategoryMatch } from "./category-mapping";

/**
 * Helper to get attribute value from WooCommerce product
 */
export const getAttributeValue = (product: WooCommerceProduct, attributeName: string): string | undefined => {
  const attribute = product.attributes.find(attr => 
    attr.name.toLowerCase() === attributeName.toLowerCase()
  );
  return attribute ? attribute.option : undefined;
};

/**
 * Helper to check if product has a specific attribute value
 */
export const hasAttribute = (product: WooCommerceProduct, attributeName: string, value: string): boolean => {
  const attributeValue = getAttributeValue(product, attributeName);
  return attributeValue ? attributeValue.toLowerCase() === value.toLowerCase() : false;
};

/**
 * Convert a WooCommerce product to our Product format
 */
export const convertWooCommerceProduct = (wooProduct: WooCommerceProduct): Product => {
  // Extract THC and CBD values from meta_data if available
  const thcMeta = wooProduct.meta_data.find(meta => meta.key === 'thc_content');
  const cbdMeta = wooProduct.meta_data.find(meta => meta.key === 'cbd_content');
  const strainMeta = wooProduct.meta_data.find(meta => meta.key === 'strain_type');
  const effectsMeta = wooProduct.meta_data.find(meta => meta.key === 'effects');
  const flavorsMeta = wooProduct.meta_data.find(meta => meta.key === 'flavors');
  
  // Get category name using the enhanced mapping system
  let bestCategory = 'Uncategorized';
  
  if (wooProduct.categories && wooProduct.categories.length > 0) {
    // First try to match exactly, then try to find the best match
    for (const cat of wooProduct.categories) {
      const mappedCategory = getCategoryMapping(cat.name);
      if (mappedCategory !== cat.name) {
        // Found a direct mapping
        bestCategory = mappedCategory;
        break;
      }
      
      // Look for keyword matches if no direct mapping
      const keywords = getBestCategoryMatch(cat.name);
      if (keywords) {
        bestCategory = keywords;
        break;
      }
    }
    
    // If no match found, use the first category
    if (bestCategory === 'Uncategorized' && wooProduct.categories[0].name) {
      bestCategory = wooProduct.categories[0].name;
    }
  }

  console.log(`Mapped WooCommerce product [${wooProduct.name}] category to: ${bestCategory}`);

  // Parse effects and flavors arrays
  let effects: string[] = [];
  let flavors: string[] = [];
  
  if (effectsMeta && typeof effectsMeta.value === 'string') {
    try {
      effects = JSON.parse(effectsMeta.value);
    } catch (e) {
      effects = effectsMeta.value.split(',').map(item => item.trim());
    }
  }
  
  if (flavorsMeta && typeof flavorsMeta.value === 'string') {
    try {
      flavors = JSON.parse(flavorsMeta.value);
    } catch (e) {
      flavors = flavorsMeta.value.split(',').map(item => item.trim());
    }
  }

  // Convert to our Product format
  return {
    id: String(wooProduct.id),
    name: wooProduct.name,
    price: parseFloat(wooProduct.price) || 0,
    description: wooProduct.description,
    image: wooProduct.images && wooProduct.images.length > 0 ? wooProduct.images[0].src : '/placeholder.svg',
    images: wooProduct.images.map(img => img.src),
    thc: thcMeta?.value as string || undefined,
    cbd: cbdMeta?.value as string || undefined,
    category: bestCategory,
    strain: strainMeta?.value as string || undefined,
    effects: effects,
    flavors: flavors,
    weight: getAttributeValue(wooProduct, 'weight'),
    potency: getAttributeValue(wooProduct, 'potency'),
    lab_tested: hasAttribute(wooProduct, 'lab_tested', 'yes'),
    source: "woocommerce"
  };
};
