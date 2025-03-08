
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock wishlist data
const mockWishlist = [
  {
    id: 'p1',
    name: 'CBD Öl 15%',
    image: '/lovable-uploads/2e4972d1-cad4-4080-8445-33fcfdee5f57.png',
    price: '79,90 €',
    inStock: true
  },
  {
    id: 'p2',
    name: 'Premium Hanftee',
    image: '/lovable-uploads/8db2393e-a67f-435f-9eb7-467e1a367470.png',
    price: '19,95 €',
    inStock: true
  },
  {
    id: 'p3',
    name: 'Cannabis Blüten (Indoor)',
    image: '/lovable-uploads/51f7c998-91ad-4cf3-ba40-81d2f23bbddc.png',
    price: '49,90 €',
    inStock: false
  }
];

const WishlistItems = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Meine Wunschliste</h2>
      
      {mockWishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockWishlist.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background text-destructive"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </Button>
                </div>
                
                <div className="p-4 space-y-3">
                  <Link 
                    to={`/product/${item.id}`} 
                    className="text-lg font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                  
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{item.price}</p>
                    <div className="flex items-center">
                      {item.inStock ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                          Auf Lager
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 flex items-center gap-1">
                          <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                          Nicht auf Lager
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full gap-2"
                    disabled={!item.inStock}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    In den Warenkorb
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <div className="py-10 space-y-4">
            <div className="flex justify-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Ihre Wunschliste ist leer</h3>
            <p className="text-muted-foreground">
              Fügen Sie Produkte zu Ihrer Wunschliste hinzu, um sie später zu kaufen
            </p>
            <Button asChild>
              <Link to="/products">Jetzt stöbern</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WishlistItems;
