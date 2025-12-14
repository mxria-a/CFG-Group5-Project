import { render, screen, fireEvent } from '@testing-library/react';
import Basket from './Basket';
import { StoreContext } from '../../Context/shop-context';

describe('Basket Component', () => {
  const mockRemoveFromBasket = jest.fn();
  const mockGetTotalBasketAmount = jest.fn(() => 32); // total of basket items

  const foodList = [
    { itemID: '101', itemName: 'Burger', price: 10.0, image: '' },
    { itemID: '102', itemName: 'Pizza', price: 12.0, image: '' },
  ];

  const basketItems = {
    101: 2, // Two Burgers
    102: 1, // One Pizza
  };

  const renderBasket = (overrides = {}) =>
    render(
      <StoreContext.Provider
        value={{
          basketItems,
          foodList,
          removeFromBasket: mockRemoveFromBasket,
          getTotalBasketAmount: mockGetTotalBasketAmount,
          ...overrides,
        }}
      >
        <Basket />
      </StoreContext.Provider>
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders basket headings', () => {
    renderBasket();

    expect(screen.getByText('Items')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    const totalTexts = screen.getAllByText('Total');
    expect(totalTexts.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  test('renders basket items with correct totals', () => {
    renderBasket();

    // Item names
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();

    // Item prices
    expect(screen.getByText('£10')).toBeInTheDocument();
    expect(screen.getByText('£12')).toBeInTheDocument();

    // Quantities
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    // Total per item
    expect(screen.getByText('£20.00')).toBeInTheDocument();
    expect(screen.getByText('£12.00')).toBeInTheDocument();

    // Basket totals
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText(32)).toBeInTheDocument(); // 2*10 + 1*12
    expect(screen.getByText('Delivery Fee')).toBeInTheDocument();
    expect(screen.getByText('£2')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('£34.00')).toBeInTheDocument(); // subtotal + delivery
  });

  test('removes item when remove button is clicked', () => {
    renderBasket();
    const removeButtons = screen.getAllByText('x');
    fireEvent.click(removeButtons[0]);
    expect(mockRemoveFromBasket).toHaveBeenCalledWith('101');
  });

  test('renders promo code section', () => {
    renderBasket();
    expect(screen.getByText('Add promo code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Promo Code')).toBeInTheDocument();
    expect(screen.getByText('Apply Code')).toBeInTheDocument();
  });

  test('renders correctly when basket is empty', () => {
    renderBasket({
      basketItems: {},
      foodList: [],
      getTotalBasketAmount: () => 0,
    });

    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('£0.00')).toBeInTheDocument();
    expect(screen.getByText('Delivery Fee')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('£0.00')).toBeInTheDocument();
    const removeButtons = screen.queryAllByText('x');
    expect(removeButtons.length).toBe(0);
    expect(screen.getByText('Add promo code')).toBeInTheDocument();
  });

  test('display fallback image when item image is missing', () => {
    renderBasket();
    const burgerImage = screen.getByAltText('Burger');
    expect(burgerImage.src).toContain('https://placehold.co/50');
  });
});
