
export interface Message {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  messageId?: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}
