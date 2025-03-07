
import React from "react";
import Layout from "@/components/Layout";
import WooCommerceConfig from "@/components/admin/WooCommerceConfig";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminConfig: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Store Configuration</h1>
            <p className="text-muted-foreground mt-2">
              Configure your store integrations and settings.
            </p>
          </div>
          
          <WooCommerceConfig />
          
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="text-lg font-medium text-amber-800 mb-2">WooCommerce Setup Guide</h3>
            <div className="text-sm text-amber-700 space-y-2">
              <p>To set up WooCommerce integration, follow these steps:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Log in to your WordPress admin dashboard</li>
                <li>Navigate to WooCommerce &gt; Settings &gt; Advanced &gt; REST API</li>
                <li>Click "Add key"</li>
                <li>
                  Enter a description (e.g., "Cannabis Store App"), set permissions to "Read",
                  and click "Generate API Key"
                </li>
                <li>Copy the Consumer Key and Consumer Secret</li>
                <li>Paste them into the configuration form above</li>
                <li>Enter your WordPress site URL</li>
                <li>Click "Save Configuration" and then "Test Connection"</li>
              </ol>
              
              <p className="mt-4">
                <strong>Important:</strong> Make sure your WooCommerce products have the following
                custom fields set up to work properly with this app:
              </p>
              
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>thc_content</strong>: THC percentage (e.g., "18%" or "15-20%")
                </li>
                <li>
                  <strong>cbd_content</strong>: CBD percentage (e.g., "0.2%" or "&lt;0.2%")
                </li>
                <li>
                  <strong>strain_type</strong>: The strain type (e.g., "Indica", "Sativa", or "Hybrid")
                </li>
                <li>
                  <strong>effects</strong>: A comma-separated list or JSON array of effects
                </li>
                <li>
                  <strong>flavors</strong>: A comma-separated list or JSON array of flavors
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminConfig;
