import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeButton from "../components/ThemeButton";

describe("ThemeButton", ()=>{
it("Renders light theme by default", ()=>{
  render(<ThemeButton isDark={false} toggleDarkMode={() => {}} />);
    expect(screen.getByText("Switch to Dark Mode")).toBeInTheDocument();
})

it("Renders dark them when dark theme is true", ()=>{
  render(<ThemeButton isDark={true} toggleDarkMode={() => {}} />);
    expect(screen.getByText("Switch to Light Mode")).toBeInTheDocument();
});

it("Executes toggle dark mode when clicked", ()=>{
  const toggleDarkModeMock = jest.fn();
    render(<ThemeButton isDark={true} toggleDarkMode={toggleDarkModeMock} />);
    fireEvent.click(screen.getByTitle("Switch to Light Mode"));
    expect(toggleDarkModeMock).toHaveBeenCalled();
  });

  it("checks the state after toggling the theme", () => {
    const toggleDarkModeMock = jest.fn();
    const { rerender } = render(<ThemeButton isDark={true} toggleDarkMode={toggleDarkModeMock} />);
    fireEvent.click(screen.getByTitle("Switch to Light Mode"));
    expect(toggleDarkModeMock).toHaveBeenCalled();
    rerender(<ThemeButton isDark={false} toggleDarkMode={toggleDarkModeMock} />);
    expect(screen.getByTitle("Switch to Dark Mode")).toBeInTheDocument();
  });

  it("handles rapid toggling of the theme", () => {
    const toggleDarkModeMock = jest.fn();
    render(<ThemeButton isDark={true} toggleDarkMode={toggleDarkModeMock} />);
    const darkButton = screen.getByTitle("Switch to Light Mode");
    fireEvent.click(darkButton);
    fireEvent.click(darkButton);
    fireEvent.click(darkButton);
    expect(toggleDarkModeMock).toHaveBeenCalledTimes(3);
  });
});