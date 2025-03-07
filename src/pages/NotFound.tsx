
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-3xl font-bold mt-6 mb-4">Page Not Found</h2>
          <p className="text-foreground/70 mb-8">
            We couldn't find the page you're looking for. It might have been removed, 
            renamed, or is temporarily unavailable.
          </p>
          <Button onClick={() => navigate("/")} className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
