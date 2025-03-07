
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductGrid from '../ProductGrid';
import { BrowserRouter } from 'react-router-dom';

// Mock the ProductCard component since we're not testing it here
jest.mock('../ProductCard', () => {
  return function MockProductCard(props: any) {
    return (
      <div data-testid={`product-card-${props.id}`}>
        {props.name} - {props.price}€
      </div>
    );
  };
});

describe('ProductGrid Component', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Test Product 1',
      price: 19.99,
      image: 'test-image-1.jpg',
      description: 'Test description 1',
      category: 'Blüten',
      thc: '12%',
      cbd: '1%'
    },
    {
      id: '2',
      name: 'Test Product 2',
      price: 29.99,
      image: 'test-image-2.jpg',
      description: 'Test description 2',
      category: 'Öle',
      thc: '5%',
      cbd: '15%'
    }
  ];

  test('renders all products in the grid', () => {
    render(
      <BrowserRouter>
        <ProductGrid products={mockProducts} />
      </BrowserRouter>
    );
    
    // Check if all products are rendered
    mockProducts.forEach(product => {
      expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
    });
  });

  test('applies animation styles to product cards', () => {
    render(
      <BrowserRouter>
        <ProductGrid products={mockProducts} />
      </BrowserRouter>
    );
    
    // Get the container divs of the product cards
    const productContainers = screen.getAllByTestId(/product-card-/);
    
    // Check if their parent elements have animation styles
    productContainers.forEach((container, index) => {
      const parentElement = container.parentElement;
      expect(parentElement?.className).toContain('animate-slide-up');
      expect(parentElement?.style.animationDelay).toBe(`${index * 100}ms`);
    });
  });

  test('shows "No products found" message when products array is empty', () => {
    render(
      <BrowserRouter>
        <ProductGrid products={[]} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.getByText('We couldn\'t find any products in this category.')).toBeInTheDocument();
  });
});
