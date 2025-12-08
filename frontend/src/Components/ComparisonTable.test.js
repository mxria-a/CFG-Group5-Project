import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComparisonTable from './ComparisonTable';

// 1. Mock Data Setup
const mockItems = [
  {
    itemID: 1,
    itemName: 'Burger A',
    price: 10.50,
    restaurantName: 'Burger King',
    deliveryTime: 30,
    avRating: 4.5,
    calories: 800,
    allergens: 'Gluten',
    isVegan: false,
    // FIX: Made this string SHORT (under 50 chars) so it won't trigger "View More"
    ingredients: 'Bun, Meat, Cheese, Ketchup' 
  },
  {
    itemID: 2,
    itemName: 'Vegan Burger',
    price: 12.00,
    restaurantName: 'Green Eats',
    deliveryTime: 45,
    avRating: 4.8,
    calories: 500,
    allergens: 'Soy',
    isVegan: true,
    // Keep this one LONG to trigger the "View More" button
    ingredients: 'Plant patty, lettuce, tomato, cucumber, special vegan sauce, sesame bun, onion rings, pickles, avocado, mushrooms, spinach, kale'
  }
];

describe('ComparisonTable Component', () => {

  // Test 1: Basic Rendering
  test('renders "No items selected" when list is empty', () => {
    render(<ComparisonTable items={[]} />);
    expect(screen.getByText(/No items selected/i)).toBeInTheDocument();
  });

  test('renders correctly with items', () => {
    render(<ComparisonTable items={mockItems} />);
    
    expect(screen.getByText('Compare Options')).toBeInTheDocument();
    expect(screen.getByText('Burger A')).toBeInTheDocument();
    expect(screen.getByText('Vegan Burger')).toBeInTheDocument();
    expect(screen.getByText('£10.5')).toBeInTheDocument(); 
    expect(screen.getByText('£12')).toBeInTheDocument(); 
  });

  // Test 2: Add to Cart Interaction
  test('calls onSelectWinner and shows notification when "Add to Cart" is clicked', async () => {
    const mockSelectWinner = jest.fn();
    render(<ComparisonTable items={mockItems} onSelectWinner={mockSelectWinner} />);

    const addButtons = screen.getAllByText(/Add to Cart/i);
    fireEvent.click(addButtons[0]);

    expect(mockSelectWinner).toHaveBeenCalledTimes(1);
    expect(mockSelectWinner).toHaveBeenCalledWith(mockItems[0]);

    await waitFor(() => {
        expect(screen.getByText(/Item added to cart!/i)).toBeInTheDocument();
    });
  });

  // Test 3: Toggle Ingredients Logic
  test('toggles "View More" and "View Less" for long ingredients', () => {
    render(<ComparisonTable items={mockItems} />);

    // Now this will only find ONE button (for the second item), so it won't crash
    const viewMoreButton = screen.getByText('View More');
    expect(viewMoreButton).toBeInTheDocument();

    // Click to expand
    fireEvent.click(viewMoreButton);

    // Should now change to "View Less"
    expect(screen.getByText('View Less')).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(screen.getByText('View Less'));
    expect(screen.getByText('View More')).toBeInTheDocument();
  });

});