import { render, screen, fireEvent } from '@testing-library/react';
import ItemList from './ItemList';

const mockItems = [
    // Sample items for testing 
    // this will not interfere with actual data fetching
  {
    itemID: 101, 
    itemName: 'Cheese Pizza',
    price: 12.50,
    deliveryTime: 30,
    restaurantName: 'Pizza Hut'
  },
  {
    itemID: 102, 
    itemName: 'Chicken Wrap',
    price: 8.99,
    deliveryTime: 20,
    restaurantName: 'KFC'
  }
];

describe('ItemList Component', () => {

  test('renders item details correctly', () => {
    render(<ItemList items={mockItems} selectedItems={[]} onToggle={jest.fn()} />);

    expect(screen.getByText('Cheese Pizza')).toBeInTheDocument();
    expect(screen.getByText('Chicken Wrap')).toBeInTheDocument();
    
    expect(screen.getByText(/£12\.50?/)).toBeInTheDocument();
    expect(screen.getByText(/from Pizza Hut/i)).toBeInTheDocument();
  });

  test('applies "selected" class only to selected items', () => {
    const currentlySelected = [mockItems[0]]; 
    render(
      <ItemList 
        items={mockItems} 
        selectedItems={currentlySelected} 
        onToggle={jest.fn()} 
      />
    );

    
    // added data-testid attributes to the item cards for easier selection
    const pizzaCard = screen.getByTestId('food-card-101');
    const chickenCard = screen.getByTestId('food-card-102');

    expect(pizzaCard).toHaveClass('selected');
    expect(chickenCard).not.toHaveClass('selected');
  });

  test('calls onToggle when a card is clicked', () => {
    const mockToggle = jest.fn();
    
    render(
      <ItemList 
        items={mockItems} 
        selectedItems={[]} 
        onToggle={mockToggle} 
      />
    );

    // this relies on the data-testid attributes 
    const pizzaCard = screen.getByTestId('food-card-101');
    fireEvent.click(pizzaCard);

    expect(mockToggle).toHaveBeenCalledTimes(1);
    expect(mockToggle).toHaveBeenCalledWith(mockItems[0]);
  });

});