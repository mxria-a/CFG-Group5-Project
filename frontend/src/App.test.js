import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main app title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Food Ordering App/i);
  expect(linkElement).toBeInTheDocument();
});
