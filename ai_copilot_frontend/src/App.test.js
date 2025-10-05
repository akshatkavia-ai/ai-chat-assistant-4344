import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AI Copilot chat interface', () => {
  render(<App />);
  const headerElement = screen.getByText(/AI Copilot/i);
  expect(headerElement).toBeInTheDocument();
});
