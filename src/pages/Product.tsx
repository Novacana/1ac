
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductDetail, { ProductDetailProps } from "@/components/ProductDetail";

// Sample product data - would typically come from an API
const products: ProductDetailProps[] = [
  {
    id: "1",
    name: "Premium Indica Flower",
    price: 49.99,
    description: "This premium indica strain delivers a powerful body high that melts away tension and induces deep relaxation. Grown organically in controlled environments to ensure maximum potency and consistency. Each batch is hand-trimmed and cured for optimal flavor, aroma, and effect.",
    images: [
      "https://images.unsplash.com/photo-1603909223429-69bb7101f92e?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536062385202-b11e6f2745f1?q=80&w=2787&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587754568293-1beb674e1e44?q=80&w=2940&auto=format&fit=crop",
    ],
    thc: "22%",
    cbd: "0.5%",
    category: "Flowers",
    benefits: [
      "Relief from chronic pain and inflammation",
      "Promotes deep, restful sleep",
      "Reduces anxiety and stress",
      "Relaxes muscles and eases tension",
    ],
    use: "For optimal results, use with a quality dry herb vaporizer at 180-210°C. Start with a small amount (0.1-0.2g) and gradually increase as needed. Effects typically begin within 5-10 minutes and last 2-3 hours.",
    effects: ["Deep Relaxation", "Pain Relief", "Euphoria", "Sleepiness"],
    strain: "Indica",
    terpenes: [
      { name: "Myrcene", percentage: "1.2%" },
      { name: "Limonene", percentage: "0.8%" },
      { name: "Caryophyllene", percentage: "0.6%" }
    ],
    flavors: ["Earthy", "Pine", "Sweet"],
    origin: "Indoor Cultivation, Netherlands",
    product_type: "Flower",
    weight: "3.5g",
    potency: "High"
  },
  {
    id: "2",
    name: "Full Spectrum CBD Oil",
    price: 39.99,
    description: "Our full-spectrum CBD oil contains all beneficial cannabinoids and terpenes found in hemp plants. Cold-pressed extraction preserves the plant's natural properties, ensuring maximum efficacy. This premium formula is designed to support overall wellness without psychoactive effects.",
    images: [
      "https://images.unsplash.com/photo-1556928045-16f7f50be0f3?q=80&w=2787&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590009617786-6d054a2a3c7c?q=80&w=2787&auto=format&fit=crop",
    ],
    thc: "<0.2%",
    cbd: "15%",
    category: "Oils",
    benefits: [
      "Relieves inflammation and joint pain",
      "Reduces anxiety and promotes calm",
      "Supports healthy sleep cycles",
      "Non-psychoactive wellness support",
    ],
    use: "Place 1ml (one full dropper) under the tongue and hold for 60 seconds before swallowing. Use once or twice daily. Effects typically begin within 15-45 minutes and last 4-6 hours. Consistency is key for optimal results.",
    effects: ["Calming", "Anti-inflammatory", "Stress Relief", "Balance"],
    strain: "Hemp",
    terpenes: [
      { name: "Pinene", percentage: "0.9%" },
      { name: "Linalool", percentage: "0.7%" }
    ],
    flavors: ["Herbal", "Nutty", "Natural"],
    origin: "Organic Hemp Farms, Colorado",
    product_type: "Tincture",
    weight: "30ml",
    potency: "Medium"
  },
  {
    id: "3",
    name: "Premium THC Vape Cartridge",
    price: 34.99,
    description: "Our distillate vape cartridges deliver pure THC with zero additives or cutting agents. Each cartridge is filled with strain-specific terpenes for an authentic cannabis experience. The ceramic coil technology ensures clean flavor and consistent vapor production.",
    images: [
      "https://images.unsplash.com/photo-1625657799852-21d67cc39319?q=80&w=2787&auto=format&fit=crop",
    ],
    thc: "85%",
    cbd: "0%",
    category: "Vapes",
    benefits: [
      "Fast-acting relief within minutes",
      "Precise dosing control",
      "Discreet with minimal odor",
      "No combustion or harmful smoke",
    ],
    use: "Attach to a compatible 510-thread battery. Take small inhalations (2-3 seconds) and wait 5-10 minutes between doses to gauge effects. Effects typically last 1-3 hours.",
    effects: ["Immediate Relief", "Euphoria", "Creativity", "Focus"],
    strain: "Hybrid",
    terpenes: [
      { name: "Terpinolene", percentage: "3.2%" },
      { name: "Ocimene", percentage: "2.1%" }
    ],
    flavors: ["Citrus", "Tropical", "Sweet"],
    origin: "California",
    product_type: "510 Thread Cartridge",
    weight: "1g",
    potency: "Very High"
  },
  {
    id: "4",
    name: "CBD Relief Cream",
    price: 29.99,
    description: "This premium relief cream combines 500mg of CBD with arnica, menthol, and essential oils for targeted pain relief. The fast-absorbing formula provides cooling sensation and reduces inflammation. Designed specifically for athletes and those with active lifestyles.",
    images: [
      "https://images.unsplash.com/photo-1607621048318-c2d5bdc0ee39?q=80&w=2940&auto=format&fit=crop",
    ],
    thc: "0%",
    cbd: "5%",
    category: "Topicals",
    benefits: [
      "Targeted relief for muscles and joints",
      "Reduces inflammation and swelling",
      "Cooling sensation provides immediate comfort",
      "No systemic absorption or psychoactive effects",
    ],
    use: "Apply a liberal amount to the affected area and massage gently until absorbed. Can be used up to 4 times daily as needed. Wash hands after application.",
    effects: ["Localized Relief", "Cooling Sensation", "Anti-inflammatory"],
    strain: "Hemp-derived",
    terpenes: [
      { name: "Bisabolol", percentage: "0.5%" },
      { name: "Humulene", percentage: "0.4%" }
    ],
    flavors: ["Menthol", "Eucalyptus", "Clean"],
    origin: "USA",
    product_type: "Topical Cream",
    weight: "100ml",
    potency: "Medium"
  },
  {
    id: "5",
    name: "THC-Infused Fruit Gummies",
    price: 24.99,
    description: "Our delicious fruit-flavored gummies contain precisely dosed THC for a consistent experience. Made with real fruit extracts and organic ingredients for superior taste and effect. Each gummy is infused with premium cannabis distillate for reliable potency.",
    images: [
      "https://images.unsplash.com/photo-1625517236224-4ab37a6425cb?q=80&w=2848&auto=format&fit=crop",
    ],
    thc: "5mg per piece",
    cbd: "0mg",
    category: "Edibles",
    benefits: [
      "Long-lasting effects (4-8 hours)",
      "Precise, consistent dosing",
      "Discreet consumption method",
      "Delicious flavor profile",
    ],
    use: "Begin with one gummy (5mg THC) and wait at least 60-90 minutes before consuming more. Effects typically begin within 30-90 minutes and can last 4-8 hours. Store in a cool, dry place away from direct sunlight.",
    effects: ["Long-lasting Relief", "Euphoria", "Mood Enhancement", "Appetite Stimulation"],
    strain: "Sativa",
    terpenes: [
      { name: "Limonene", percentage: "1.0%" }
    ],
    flavors: ["Strawberry", "Watermelon", "Blueberry", "Mango"],
    origin: "Made in Canada",
    product_type: "Edible",
    weight: "100mg total (20 pieces × 5mg)",
    potency: "Medium"
  },
  {
    id: "6",
    name: "Premium Herb Grinder",
    price: 19.99,
    description: "This 4-piece CNC-machined aluminum grinder features diamond-shaped teeth for efficient grinding, a pollen screen, and a kief catcher to preserve valuable trichomes. Designed for durability and performance, it's an essential tool for any enthusiast.",
    images: [
      "https://images.unsplash.com/photo-1603851887849-5eca2b0f8fae?q=80&w=2940&auto=format&fit=crop",
    ],
    category: "Accessories",
    benefits: [
      "Evenly grinds herbs for efficient vaporization",
      "Collects and preserves valuable kief/pollen",
      "Durable aircraft-grade aluminum construction",
      "Smooth magnetic closure system",
    ],
    use: "Place material between the teeth of the top two pieces, close, and twist back and forth until the desired consistency is achieved. The fine mesh screen separates plant material from kief, which collects in the bottom chamber.",
    effects: [],
    product_type: "Grinder",
    weight: "85g",
    origin: "Germany"
  },
];

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      const foundProduct = products.find(p => p.id === id) || null;
      setProduct(foundProduct);
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-foreground/70 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <a href="/" className="text-primary hover:underline">
            Browse our products
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProductDetail {...product} />
    </Layout>
  );
};

export default Product;
