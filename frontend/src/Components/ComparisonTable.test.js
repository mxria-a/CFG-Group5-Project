import { render, screen, fireEvent, within, act } from '@testing-library/react';
import ComparisonTable from './ComparisonTable';
import { StoreContext } from '../Context/shop-context';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

// Mock data
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
    ingredients: 'Plant patty, lettuce, tomato, cucumber, special vegan sauce, sesame bun, onion rings, pickles, avocado, mushrooms, spinach, kale, extra toppings'
  }
];

// helper to render with context
const renderWithContext = (component, mockAddToBasket = jest.fn()) => {
  return render(
    <StoreContext.Provider value={{ addToBasket: mockAddToBasket }}>
      {component}
    </StoreContext.Provider>
  );
};

describe('ComparisonTable Component', () => {
  
  beforeEach(() => {
    jest.useRealTimers();
  });

  // Test 1: Empty State
  test('renders "No items selected" when list is empty', () => {
    renderWithContext(<ComparisonTable items={[]} />);
    expect(screen.getByText(/no items selected/i)).toBeInTheDocument();
  });

  // Test 2: Renders Data Correctly
  test('renders item details (price, restaurant, vegan badge)', () => {
    renderWithContext(<ComparisonTable items={mockItems} />);

    expect(screen.getByText('Compare Options')).toBeInTheDocument();
    expect(screen.getByText('Burger A')).toBeInTheDocument();
    
    //Regex matcher that accepts £10.5 OR £10.50
    expect(screen.getByText(/£10\.50?/)).toBeInTheDocument();
    
    expect(screen.getByText('Burger King')).toBeInTheDocument();
    
    const veganBadges = screen.getAllByText('Yes'); 
    expect(veganBadges.length).toBeGreaterThan(0);
  });


  // Test 3: Toggle Ingredients
  test('toggles "View More" and "View Less" for long ingredients', () => {
    renderWithContext(<ComparisonTable items={mockItems} />);

    const ingredientCell = screen.getByTestId('ingredients-2');
    const viewMoreBtn = within(ingredientCell).getByRole('button', { name: /view more/i });
    fireEvent.click(viewMoreBtn);

    expect(within(ingredientCell).getByRole('button', { name: /view less/i })).toBeInTheDocument();
    expect(within(ingredientCell).getByText(/spinach/i)).toBeInTheDocument();
  });


  // Test 4: Add to Cart Logic
  test('adds item to basket and shows snackbar on click', () => {
    const mockAddToBasket = jest.fn();
    const mockOnSelectWinner = jest.fn();

    renderWithContext(
      <ComparisonTable items={mockItems} onSelectWinner={mockOnSelectWinner} />, 
      mockAddToBasket
    );

    const addButton = screen.getByTestId('add-to-cart-1');
    fireEvent.click(addButton);

    expect(mockAddToBasket).toHaveBeenCalledWith(1);
    expect(mockOnSelectWinner).toHaveBeenCalledWith(mockItems[0]);
    expect(screen.getByText(/item added to cart!/i)).toBeInTheDocument();
  });

  // Test 5: The Dialog Timeout
  test('shows Dialog after 1.5 seconds and navigates to basket', () => {
    jest.useFakeTimers(); 
    const mockAddToBasket = jest.fn();

    renderWithContext(<ComparisonTable items={mockItems} />, mockAddToBasket);

    fireEvent.click(screen.getByTestId('add-to-cart-1'));

    expect(screen.queryByText('Success!')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1600);
    });

    expect(screen.getByText('Success!')).toBeInTheDocument();
    
    const viewBasketBtn = screen.getByRole('button', { name: /view basket/i });
    fireEvent.click(viewBasketBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/basket');
    
    jest.useRealTimers();
  });
});