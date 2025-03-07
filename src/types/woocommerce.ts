
// WooCommerce product interface
export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  stock_status: string;
  stock_quantity?: number;
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  images: {
    id: number;
    src: string;
    alt: string;
  }[];
  attributes: {
    id: number;
    name: string;
    option: string;
  }[];
  meta_data: {
    key: string;
    value: string;
  }[];
}

// WooCommerce API connection settings
export interface WooCommerceConfig {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  version: string;
}
