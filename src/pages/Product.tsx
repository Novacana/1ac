
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductDetail, { ProductDetailProps } from "@/components/ProductDetail";

// Sample product data - would typically come from an API
const products: ProductDetailProps[] = [
  {
    id: "1",
    name: "Medical Cannabis Flower",
    price: 49.99,
    description: "Premium medical-grade cannabis flower, carefully cultivated under controlled conditions to ensure consistent quality and purity. This flower is ideal for patients seeking relief from chronic pain, anxiety, or sleep disorders.",
    images: [
      "https://images.unsplash.com/photo-1603909223429-69bb7101f92e?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536062385202-b11e6f2745f1?q=80&w=2787&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587754568293-1beb674e1e44?q=80&w=2940&auto=format&fit=crop",
    ],
    thc: "20%",
    cbd: "0.5%",
    category: "Flowers",
    benefits: [
      "Relief from chronic pain",
      "Reduction in anxiety symptoms",
      "Improved sleep quality",
      "Appetite stimulation",
    ],
    use: "For optimal results, use with a dry herb vaporizer at a temperature of 180-210°C. Start with a small amount and gradually increase as needed.",
    effects: ["Relaxation", "Pain Relief", "Euphoria", "Sleepiness"],
  },
  {
    id: "2",
    name: "CBD Oil Tincture",
    price: 39.99,
    description: "High-quality CBD oil tincture made from organically grown hemp plants. This full-spectrum CBD oil contains all the beneficial cannabinoids, terpenes, and flavonoids found in the hemp plant, but with less than 0.2% THC.",
    images: [
      "https://images.unsplash.com/photo-1556928045-16f7f50be0f3?q=80&w=2787&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590009617786-6d054a2a3c7c?q=80&w=2787&auto=format&fit=crop",
    ],
    thc: "<0.2%",
    cbd: "10%",
    category: "Oils",
    benefits: [
      "Relief from inflammation",
      "Reduction in anxiety and stress",
      "Better sleep quality",
      "Non-psychoactive (won't get you high)",
    ],
    use: "Place 1-2 drops under the tongue and hold for 60 seconds before swallowing. Use once or twice daily as needed.",
    effects: ["Calming", "Anti-inflammatory", "Stress Relief"],
  },
  {
    id: "3",
    name: "THC Vape Cartridge",
    price: 34.99,
    description: "Premium THC vape cartridge with pure cannabis extract. This cartridge delivers a consistent dose of THC in a convenient, discreet form. Compatible with standard 510-thread batteries.",
    images: [
      "https://images.unsplash.com/photo-1625657799852-21d67cc39319?q=80&w=2787&auto=format&fit=crop",
    ],
    thc: "80%",
    cbd: "0%",
    category: "Vapes",
    benefits: [
      "Fast-acting relief",
      "Precise dosing",
      "Discreet and convenient",
      "No combustion required",
    ],
    use: "Attach to a compatible 510-thread battery. Take small puffs and wait 5-10 minutes between doses to gauge effects.",
    effects: ["Immediate Relief", "Euphoria", "Relaxation"],
  },
  {
    id: "4",
    name: "Hemp-Infused Body Cream",
    price: 29.99,
    description: "Soothing hemp-infused body cream with 500mg of CBD. This luxurious cream is formulated to provide targeted relief for muscle and joint discomfort while moisturizing your skin.",
    images: [
      "https://images.unsplash.com/photo-1607621048318-c2d5bdc0ee39?q=80&w=2940&auto=format&fit=crop",
    ],
    thc: "0%",
    cbd: "5%",
    category: "Topicals",
    benefits: [
      "Targeted relief for sore muscles and joints",
      "Moisturizing and nourishing for skin",
      "Non-psychoactive",
      "No greasy residue",
    ],
    use: "Apply a small amount to the affected area and massage gently. Can be used up to 3-4 times daily as needed.",
    effects: ["Localized Relief", "Skin Hydration", "Cooling Sensation"],
  },
  {
    id: "5",
    name: "Cannabis-Infused Gummies",
    price: 24.99,
    description: "Delicious fruit-flavored gummies infused with precise doses of cannabis extract. Each gummy contains 5mg of THC for a consistent, enjoyable experience.",
    images: [
      "https://images.unsplash.com/photo-1625517236224-4ab37a6425cb?q=80&w=2848&auto=format&fit=crop",
    ],
    thc: "5mg per piece",
    cbd: "0mg",
    category: "Edibles",
    benefits: [
      "Longer-lasting effects compared to smoking",
      "Precise dosing",
      "Discreet and convenient",
      "Great taste",
    ],
    use: "Begin with one gummy and wait at least 60-90 minutes before consuming more. Effects can last 4-6 hours.",
    effects: ["Long-lasting Relief", "Euphoria", "Relaxation", "Appetite Stimulation"],
  },
  {
    id: "6",
    name: "Premium Grinder",
    price: 19.99,
    description: "High-quality 4-piece herb grinder made from aircraft-grade aluminum. Features sharp teeth for efficient grinding, a pollen screen, and a kief catcher.",
    images: [
      "https://images.unsplash.com/photo-1603851887849-5eca2b0f8fae?q=80&w=2940&auto=format&fit=crop",
    ],
    category: "Accessories",
    benefits: [
      "Evenly grinds herb for efficient consumption",
      "Collects valuable pollen/kief",
      "Durable construction",
      "Easy to clean",
    ],
    use: "Place material between the teeth of the top two pieces, close, and twist back and forth until the desired consistency is achieved.",
    effects: [],
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
