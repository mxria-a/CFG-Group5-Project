import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main app title', () => {
  render(<App />);
  const elements = screen.getAllByText(/Pickier/i);
  
  // We just check that at least one exists.
  expect(elements.length).toBeGreaterThan(0);
});

