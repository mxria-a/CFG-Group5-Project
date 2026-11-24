import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./Pages/Homepage', () => ({ __esModule: true, default: function MockHome() {
  const { useLocation } = require('react-router-dom');
  const location = useLocation();
  return <div>{location.search === '?showdown=1' ? 'Showdown is open' : 'Results are open'}</div>;
} }));
jest.mock('./Pages/Basket/basket', () => ({ __esModule: true, default: () => <div>Basket is open</div> }));

beforeEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState({}, '', '/');
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
});

test('Showdown tab stays hidden until at least two dishes are picked', () => {
  render(<App />);
  expect(screen.queryByRole('link', { name: /showdown, .* dishes/i })).toBeNull();
});

test('two selected dishes reveal Showdown and keep it accessible from Basket', () => {
  window.sessionStorage.setItem('pickier-comparison-picks', JSON.stringify([
    { itemID: 1, itemName: 'Pizza', price: 7.5 },
    { itemID: 2, itemName: 'Burger', price: 9.5 },
  ]));
  window.sessionStorage.setItem('pickier-last-search', JSON.stringify({ item: 'pizza', postcode: 'E1 6AN' }));
  render(<App />);
  const showdownLink = screen.getByRole('link', { name: 'Showdown, 2 dishes' });
  expect(showdownLink).toHaveTextContent('Showdown (2)');
  fireEvent.click(showdownLink);
  expect(screen.getByText('Showdown is open')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: /basket/i }));
  expect(screen.getByText('Basket is open')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Showdown, 2 dishes' }));
  expect(screen.getByText('Showdown is open')).toBeInTheDocument();
});

test('the Showdown count reflects three selected dishes', () => {
  window.sessionStorage.setItem('pickier-comparison-picks', JSON.stringify([
    { itemID: 1, itemName: 'Pizza' },
    { itemID: 2, itemName: 'Burger' },
    { itemID: 3, itemName: 'Sushi' },
  ]));
  render(<App />);
  expect(screen.getByRole('link', { name: 'Showdown, 3 dishes' })).toHaveTextContent('Showdown (3)');
});
