import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ComparisonTable from '../Components/ComparisonTable';
import CheckoutPage from './CheckoutPage';
import { StoreContext } from '../Context/shop-context';
import { buildBasketSummary } from '../utils/basketSummary';
import { getBasketLineDetails } from '../utils/basketLineDetails';
import { getLastSearch, saveLastSearch } from '../utils/searchSession';

const foodList = [
  { itemID: 1, itemName:'Four Cheese Pizza', restaurantName:'Pizza Express', price:12.5, ingredients:'Cheddar, Mozzarella, Tomato' },
  { itemID: 2, itemName:'Veg Burger', restaurantName:'Burger King', price:9.5, ingredients:'Bun, Lettuce, Patty' },
];

test('standard basket details reflect supplied ingredients without invented customisations', () => {
  const summary = buildBasketSummary(foodList, { 1:1 });
  expect(getBasketLineDetails(summary.rows[0])).toEqual(['Cheddar', 'Mozzarella', 'Tomato']);
  expect(summary.rows[0].size).toBeNull();
});

test('Add all to basket adds compared dishes without leaving Showdown', () => {
  const addToBasket = jest.fn();
  const showBasketToast = jest.fn();
  render(<StoreContext.Provider value={{ addToBasket, showBasketToast }}><ComparisonTable items={foodList} /></StoreContext.Provider>);
  fireEvent.click(screen.getByRole('button', { name:/add all to basket/i }));
  expect(addToBasket).toHaveBeenCalledTimes(2);
  expect(addToBasket).toHaveBeenCalledWith(1);
  expect(addToBasket).toHaveBeenCalledWith(2);
  expect(showBasketToast).toHaveBeenCalledWith({itemName:'selected dishes'}, 2);
  expect(screen.getByRole('heading', { name:/the showdown/i })).toBeInTheDocument();
});

test('Pay now animates, retains confirmation snapshot, and clears the basket', () => {
  jest.useFakeTimers();
  window.scrollTo = jest.fn();
  const clearBasket = jest.fn();
  render(<MemoryRouter><StoreContext.Provider value={{ foodList, basketItems:{1:1}, demoCustomLines:{}, clearBasket }}><CheckoutPage /></StoreContext.Provider></MemoryRouter>);
  fireEvent.change(screen.getByPlaceholderText('Your full name'), {target:{value:'Taylor Test'}});
  fireEvent.change(screen.getByPlaceholderText('07...'), {target:{value:'07123456789'}});
  fireEvent.change(screen.getByPlaceholderText('House number and street'), {target:{value:'1 Test Street'}});
  fireEvent.change(screen.getByPlaceholderText('London'), {target:{value:'London'}});
  fireEvent.change(screen.getByPlaceholderText('E.g. E1 6AN'), {target:{value:'E1 6AN'}});
  fireEvent.click(screen.getByRole('button', {name:'Pay now'}));
  expect(screen.getByText('Getting things ready...')).toBeInTheDocument();
  expect(clearBasket).not.toHaveBeenCalled();
  act(() => { jest.advanceTimersByTime(2250); });
  expect(screen.getByText('Getting things ready...')).toBeInTheDocument();
  expect(clearBasket).not.toHaveBeenCalled();
  act(() => { jest.advanceTimersByTime(1750); });
  expect(clearBasket).toHaveBeenCalledTimes(1);
  expect(screen.getByText('Looking good!')).toBeInTheDocument();
  expect(screen.getByText('Four Cheese Pizza')).toBeInTheDocument();
  expect(screen.getByRole('button', {name:'Browse more dishes'})).toBeInTheDocument();
  expect(screen.queryByText('Back to checkout')).not.toBeInTheDocument();
  saveLastSearch({ item: 'burger', postcode: 'E1 6AN' });
  fireEvent.click(screen.getByRole('button', {name:'Browse more dishes'}));
  expect(getLastSearch()).toEqual({ item:'', postcode:'E1 6AN' });
  jest.useRealTimers();
});
