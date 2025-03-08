
import { ShopifyProduct } from "@/types/shopify";
import { Product } from "@/types/product";

/**
 * Convert a Shopify product to our Product format
 */
export const convertShopifyProduct = (shopifyProduct: ShopifyProduct): Product => {
  // Extract variant information (using first variant as default)
  const firstVariant = shopifyProduct.variants[0] || {};
  
  // Safely access price - check if variants exist and have price property
  const price = shopifyProduct.variants.length > 0 && 'price' in firstVariant 
    ? parseFloat(firstVariant.price) 
    : 0;
  
  // Extract image information
  const mainImage = shopifyProduct.images.length > 0 ? shopifyProduct.images[0].src : '/placeholder.svg';
  const allImages = shopifyProduct.images.map(img => img.src);
  
  // Try to extract cannabinoid content from tags or metafields (if available)
  let thcContent: string | undefined;
  let cbdContent: string | undefined;
  let strainType: string | undefined;
  
  // Check in tags for THC, CBD content and strain type
  if (shopifyProduct.tags && shopifyProduct.tags.length > 0) {
    for (const tag of shopifyProduct.tags) {
      if (tag.toLowerCase().startsWith('thc:')) {
        thcContent = tag.substring(4).trim();
      } else if (tag.toLowerCase().startsWith('cbd:')) {
        cbdContent = tag.substring(4).trim();
      } else if (tag.toLowerCase().startsWith('strain:')) {
        strainType = tag.substring(7).trim();
      }
    }
  }
  
  // Extract effects and flavors from tags if available
  const effects: string[] = [];
  const flavors: string[] = [];
  
  if (shopifyProduct.tags) {
    for (const tag of shopifyProduct.tags) {
      if (tag.toLowerCase().startsWith('effect:')) {
        effects.push(tag.substring(7).trim());
      } else if (tag.toLowerCase().startsWith('flavor:')) {
        flavors.push(tag.substring(7).trim());
      }
    }
  }

  return {
    id: String(shopifyProduct.id),
    name: shopifyProduct.title,
    price: price,
    description: shopifyProduct.description,
    image: mainImage,
    images: allImages,
    thc: thcContent,
    cbd: cbdContent,
    category: shopifyProduct.product_type || 'Uncategorized',
    strain: strainType,
    effects: effects,
    flavors: flavors,
    weight: undefined, // Not directly available in basic Shopify data
    potency: undefined, // Not directly available in basic Shopify data
    lab_tested: shopifyProduct.tags?.includes('lab-tested') || false
  };
};
