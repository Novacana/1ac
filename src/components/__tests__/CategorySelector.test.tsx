
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategorySelector from '../CategorySelector';

describe('CategorySelector Component', () => {
  const mockCategories = ['Blüten', 'Öle', 'Edibles'];
  const mockOnSelectCategory = jest.fn();
  
  beforeEach(() => {
    mockOnSelectCategory.mockClear();
  });

  test('renders all category pills', () => {
    render(
      <CategorySelector 
        categories={mockCategories} 
        selectedCategory="Blüten" 
        onSelectCategory={mockOnSelectCategory} 
      />
    );
    
    // Check if all categories are rendered
    mockCategories.forEach(category => {
      expect(screen.getByTitle(category)).toBeInTheDocument();
    });
  });

  test('correctly marks the selected category', () => {
    const { rerender } = render(
      <CategorySelector 
        categories={mockCategories} 
        selectedCategory="Blüten" 
        onSelectCategory={mockOnSelectCategory} 
      />
    );
    
    // Get all buttons
    const buttons = screen.getAllByRole('button');
    
    // The first button should have the default variant (active)
    expect(buttons[0].className).toContain('bg-primary');
    
    // Rerender with a different selected category
    rerender(
      <CategorySelector 
        categories={mockCategories} 
        selectedCategory="Öle" 
        onSelectCategory={mockOnSelectCategory} 
      />
    );
    
    // Now the second button should be active
    const updatedButtons = screen.getAllByRole('button');
    expect(updatedButtons[1].className).toContain('bg-primary');
  });

  test('calls onSelectCategory when a category is clicked', () => {
    render(
      <CategorySelector 
        categories={mockCategories} 
        selectedCategory="Blüten" 
        onSelectCategory={mockOnSelectCategory} 
      />
    );
    
    // Click on the second category
    fireEvent.click(screen.getByTitle('Öle'));
    
    // Check if the callback was called with the correct category
    expect(mockOnSelectCategory).toHaveBeenCalledWith('Öle');
  });

  test('applies animation styles to category pills', () => {
    render(
      <CategorySelector 
        categories={mockCategories} 
        selectedCategory="Blüten" 
        onSelectCategory={mockOnSelectCategory} 
      />
    );
    
    // Check if animation styles are applied
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button, index) => {
      expect(button.className).toContain('animate-scale-in');
      expect(button.style.animationDelay).toBe(`${index * 50}ms`);
    });
  });
});
