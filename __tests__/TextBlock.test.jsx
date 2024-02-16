import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import {TextBlock} from "../components/TextBlock";

describe("TextBlock", ()=>{
 
  it("Renders a empty textarea correctly", () => {
    render(<TextBlock text=" " />);
    expect(screen.getByRole('textbox')).toHaveValue(" ");
  });

  it("Calls onChange handler when text is changed", () => {
    const mockOnChange = jest.fn();
    render(<TextBlock text="" onChange={mockOnChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Text' } });
    expect(mockOnChange).toHaveBeenCalledWith('New Text');
  });

  it("Disables textarea when editable prop is false", () => {
    render(<TextBlock text="Disabled" editable={false} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it("Enables textarea when editable prop is true", () => {
    render(<TextBlock text="Enabled" editable={true} />);
    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it("Displays character count", () => {
    render(<TextBlock text="Count Me" maxCharacterCount={10} />);
    expect(screen.getByText("8/10")).toBeInTheDocument();
  });

})