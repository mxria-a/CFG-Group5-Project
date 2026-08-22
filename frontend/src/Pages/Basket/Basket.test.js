import { render, screen, fireEvent } from '@testing-library/react';
import Basket from './basket';
import { StoreContext } from '../../Context/shop-context';

describe('Basket Component', () => {
  const mockAddToBasket = jest.fn();
  const mockRemoveFromBasket = jest.fn();
  const mockRemoveItemFromBasket = jest.fn();
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
          addToBasket: mockAddToBasket,
          removeFromBasket: mockRemoveFromBasket,
          removeItemFromBasket: mockRemoveItemFromBasket,
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

  test('renders the Basket page title', () => {
    renderBasket();
    expect(screen.getByText('Basket')).toBeInTheDocument();
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

    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();

    expect(screen.getByText('£10')).toBeInTheDocument();
    expect(screen.getByText('£12')).toBeInTheDocument();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    expect(screen.getByText('£20.00')).toBeInTheDocument();
    expect(screen.getByText('£12.00')).toBeInTheDocument();

    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText(32)).toBeInTheDocument();
    expect(screen.getByText('Delivery Fee')).toBeInTheDocument();
    expect(screen.getByText('£2')).toBeInTheDocument();
    expect(screen.getByText('£34.00')).toBeInTheDocument();
  });

  test('removes item entirely when the x button is clicked', () => {
    renderBasket();
    const removeButtons = screen.getAllByText('x');
    fireEvent.click(removeButtons[0]);
    expect(mockRemoveItemFromBasket).toHaveBeenCalledWith('101');
    expect(mockRemoveFromBasket).not.toHaveBeenCalled();
  });

  test('quantity stepper increases and decreases quantity', () => {
    renderBasket();
    const increaseButtons = screen.getAllByLabelText(/Increase quantity/i);
    const decreaseButtons = screen.getAllByLabelText(/Decrease quantity/i);

    fireEvent.click(increaseButtons[0]);
    expect(mockAddToBasket).toHaveBeenCalledWith('101');

    fireEvent.click(decreaseButtons[0]);
    expect(mockRemoveFromBasket).toHaveBeenCalledWith('101');
  });

  test('shows a warning when more than one distinct item type is in the basket', () => {
    renderBasket();
    expect(
      screen.getByText(/checkout currently only supports one dish/i)
    ).toBeInTheDocument();
  });

  test('does not show the warning with only one distinct item type', () => {
    renderBasket({ basketItems: { 101: 2 } });
    expect(
      screen.queryByText(/checkout currently only supports one dish/i)
    ).not.toBeInTheDocument();
  });

  test('renders promo code section', () => {
    renderBasket();
    expect(screen.getByText('Add promo code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Promo Code')).toBeInTheDocument();
    expect(screen.getByText('Apply Code')).toBeInTheDocument();
  });

  test('shows the empty-basket screen when there are no items', () => {
    renderBasket({
      basketItems: {},
      foodList: [],
      getTotalBasketAmount: () => 0,
    });

    expect(screen.getByText('Your basket is empty')).toBeInTheDocument();
    expect(screen.getByText('Browse takeaways')).toBeInTheDocument();
    expect(screen.queryByText('Subtotal')).not.toBeInTheDocument();
    expect(screen.queryAllByText('x').length).toBe(0);
  });

  test('shows an emoji placeholder when item image is missing', () => {
    renderBasket();
    const placeholder = screen.getByLabelText('Burger', { selector: '[role="img"]' });
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('🍽️');
  });
});