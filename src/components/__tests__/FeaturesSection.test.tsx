
import React from 'react';
import { render, screen } from '@testing-library/react';
import FeaturesSection from '../FeaturesSection';

describe('FeaturesSection Component', () => {
  const mockTitle = 'Test Features';
  const mockFeatures = [
    {
      title: 'Feature 1',
      description: 'Description for feature 1'
    },
    {
      title: 'Feature 2',
      description: 'Description for feature 2'
    },
    {
      title: 'Feature 3',
      description: 'Description for feature 3'
    }
  ];

  test('renders the section title', () => {
    render(<FeaturesSection title={mockTitle} features={mockFeatures} />);
    
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
  });

  test('renders all feature titles and descriptions', () => {
    render(<FeaturesSection title={mockTitle} features={mockFeatures} />);
    
    mockFeatures.forEach(feature => {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    });
  });

  test('applies animation styles to feature cards', () => {
    render(<FeaturesSection title={mockTitle} features={mockFeatures} />);
    
    // Get all feature title elements
    const featureTitles = mockFeatures.map(feature => screen.getByText(feature.title));
    
    // Check if their parent elements (the cards) have animation styles
    featureTitles.forEach((titleElement, index) => {
      // Find the parent card element
      const cardElement = titleElement.closest('div[class*="animate-scale-in"]');
      expect(cardElement).toBeInTheDocument();
      
      // Use getAttribute instead of style property as it's not available in testing environment
      const styleAttribute = cardElement?.getAttribute('style');
      expect(styleAttribute).toContain(`animation-delay: ${index * 100}ms`);
    });
  });

  test('applies responsive layout with grid', () => {
    render(<FeaturesSection title={mockTitle} features={mockFeatures} />);
    
    // Check if the grid container has the correct classes
    const gridContainer = screen.getByText(mockFeatures[0].title).closest('div[class*="grid"]');
    expect(gridContainer?.className).toContain('grid');
    expect(gridContainer?.className).toContain('sm:grid-cols-2');
    expect(gridContainer?.className).toContain('lg:grid-cols-3');
  });
});
