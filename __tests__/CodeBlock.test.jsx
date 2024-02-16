import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import {CodeBlock} from "../components/CodeBlock";

describe("CodeBlock", ()=>{
 
  it("Renders default code correctly on mount", ()=>{
    render(<CodeBlock />);
    const codeBlockElement = screen.getByTestId("code");
    expect(codeBlockElement).toBeInTheDocument()
  });
 
  it("Check copies to the clipboard when the copy button is clicked", async () => {
    render(<CodeBlock />);
    await screen.findByTestId("code");
    const clipboardCopy = jest.fn();
    global.navigator.clipboard = {
      writeText: clipboardCopy
    }
    const copyButton = screen.getByRole("button")
    fireEvent.click(copyButton);
    expect(clipboardCopy).toHaveBeenCalledTimes(1)
});

})