
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ProductNotFound = () => {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold mb-4">Produkt nicht gefunden</h1>
      <p className="text-foreground/70 mb-8">
        Das gesuchte Produkt existiert nicht oder wurde entfernt.
      </p>
      <Button asChild>
        <Link to="/">Unsere Produkte durchsuchen</Link>
      </Button>
    </div>
  );
};

export default ProductNotFound;
