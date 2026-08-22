import { render, screen, fireEvent, within } from '@testing-library/react';
import ComparisonTable from './ComparisonTable';
import { StoreContext } from '../Context/shop-context';

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

const renderWithContext = (component, mockAddToBasket = jest.fn()) => {
  return render(
    <StoreContext.Provider value={{ addToBasket: mockAddToBasket }}>
      {component}
    </StoreContext.Provider>
  );
};

describe('ComparisonTable Component', () => {

  test('renders "No items selected" when list is empty', () => {
    renderWithContext(<ComparisonTable items={[]} />);
    expect(screen.getByText(/no items selected/i)).toBeInTheDocument();
  });

  test('renders item details (price, restaurant, vegan badge)', () => {
    renderWithContext(<ComparisonTable items={mockItems} />);

    expect(screen.getByText('Compare Options')).toBeInTheDocument();
    expect(screen.getByText('Burger A')).toBeInTheDocument();
    expect(screen.getByText(/£10\.50?/)).toBeInTheDocument();
    expect(screen.getByText('Burger King')).toBeInTheDocument();

    const veganBadges = screen.getAllByText('Yes');
    expect(veganBadges.length).toBeGreaterThan(0);
  });

  test('toggles "View More" and "View Less" for long ingredients', () => {
    renderWithContext(<ComparisonTable items={mockItems} />);

    const ingredientCell = screen.getByTestId('ingredients-2');
    const viewMoreBtn = within(ingredientCell).getByRole('button', { name: /view more/i });
    fireEvent.click(viewMoreBtn);

    expect(within(ingredientCell).getByRole('button', { name: /view less/i })).toBeInTheDocument();
    expect(within(ingredientCell).getByText(/spinach/i)).toBeInTheDocument();
  });

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
});