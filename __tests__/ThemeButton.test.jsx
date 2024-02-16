import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeButton from "../components/ThemeButton";

describe("ThemeButton", ()=>{
it("Renders light theme by default", ()=>{
  render(<ThemeButton isDark={false} toggleDarkMode={() => {}} />);
    expect(screen.getByText("Light")).toBeInTheDocument();
})

it("Renders dark them when dark theme is true", ()=>{
  render(<ThemeButton isDark={true} toggleDarkMode={() => {}} />);
    expect(screen.getByText("Dark")).toBeInTheDocument();
});

it("Executes toggle dark mode when clicked", ()=>{
  const toggleDarkModeMock = jest.fn();
    render(<ThemeButton isDark={true} toggleDarkMode={toggleDarkModeMock} />);
    fireEvent.click(screen.getByText("Dark"));
    expect(toggleDarkModeMock).toHaveBeenCalled();
})

});