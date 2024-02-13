import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryButton from "../components/HistoryButton";

describe("HistoryButton", ()=>{

  it("renders correctly and initially collapsed", ()=>{
    render(<HistoryButton onSelect={() => {}} isDark={false} onExpand={() => {}} />);
    expect(screen.getByTestId('history')).not.toBeEmptyDOMElement()
  });

})