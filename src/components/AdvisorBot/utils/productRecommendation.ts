
import { ProductDetailProps } from "@/components/ProductDetail";
import { products } from "@/data/products";

export const processQuery = (
  userQuery: string,
  setRecommendedProducts: (products: ProductDetailProps[]) => void,
  setShowProducts: (show: boolean) => void
): string => {
  let response = "";
  let matchedProducts: ProductDetailProps[] = [];
  const lowercaseQuery = userQuery.toLowerCase();
  
  if (lowercaseQuery.includes("schmerz") || lowercaseQuery.includes("pain")) {
    response = "Für Schmerzpatienten empfehle ich folgende Produkte, die entzündungshemmend wirken oder bei stärkeren Schmerzen helfen können:";
    matchedProducts = [...products.filter(p => 
      p.effects?.some(e => e.toLowerCase().includes("schmerz")) ||
      p.benefits?.some(b => b.toLowerCase().includes("schmerz"))
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("schlaf") || lowercaseQuery.includes("sleep")) {
    response = "Bei Schlafstörungen können diese Produkte besonders hilfreich sein:";
    matchedProducts = [...products.filter(p => 
      p.effects?.some(e => e.toLowerCase().includes("schlaf")) ||
      p.benefits?.some(b => b.toLowerCase().includes("schlaf"))
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("angst") || lowercaseQuery.includes("anxiety")) {
    response = "Gegen Angstzustände wirken folgende Produkte besonders gut:";
    matchedProducts = [...products.filter(p => 
      p.effects?.some(e => e.toLowerCase().includes("angst")) ||
      p.benefits?.some(b => b.toLowerCase().includes("angst")) ||
      p.strain?.toLowerCase().includes("indica")
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("appetit") || lowercaseQuery.includes("hunger")) {
    response = "Diese Produkte können den Appetit anregen:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("indica") || 
      parseFloat(p.thc?.replace("%", "") || "0") > 15
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("thc")) {
    response = "Hier sind unsere THC-haltigen Produkte:";
    matchedProducts = [...products.filter(p => 
      parseFloat(p.thc?.replace("%", "") || "0") > 15
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("cbd")) {
    response = "Hier sind unsere CBD-haltigen Produkte:";
    matchedProducts = [...products.filter(p => 
      parseFloat(p.cbd?.replace("%", "") || "0") > 0.5
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("kreativ") || lowercaseQuery.includes("fokus") || lowercaseQuery.includes("concentration")) {
    response = "Für Kreativität und Fokus sind diese Sorten besonders geeignet:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("sativa") ||
      p.effects?.some(e => e.toLowerCase().includes("fokus") || e.toLowerCase().includes("kreativ"))
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("indica")) {
    response = "Hier sind unsere Indica-Sorten, die für tiefe Entspannung bekannt sind:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("indica")
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("sativa")) {
    response = "Hier sind unsere Sativa-Sorten, die für energetische Effekte bekannt sind:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("sativa")
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("hybrid")) {
    response = "Hier sind unsere ausgewogenen Hybrid-Sorten:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("hybrid")
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("produkt") || lowercaseQuery.includes("empfehl") || lowercaseQuery.includes("zeig")) {
    response = "Hier sind einige unserer beliebtesten Produkte:";
    matchedProducts = [...products].slice(0, 3);
  } else {
    response = "Basierend auf deiner Anfrage könnte ich dir folgende Produkte empfehlen:";
    const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
    matchedProducts = randomProducts;
  }

  setRecommendedProducts(matchedProducts);
  setShowProducts(matchedProducts.length > 0);
  
  return response;
};
