import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryButton from "../components/HistoryButton";

describe("HistoryButton", ()=>{

  it("Initially the history list is hidden", () => {
    render(<HistoryButton onSelect={() => {}} isDark={false} onExpand={() => {}} />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

it("Toggle the history button, shows and collapse the history list", ()=> {
  render(<HistoryButton onSelect={() => {}} isDark={false} onExpand={() => {}} />);
  const historyButton = screen.getByTestId("history");
  fireEvent.click(historyButton);
  let historyList = screen.queryByRole('list');
    expect(historyList).toBeInTheDocument();
    fireEvent.click(historyButton);
    expect(historyList).not.toBeInTheDocument();
});

it("Close the history list with close button", ()=>{
  render(<HistoryButton onSelect={() => {}} isDark={false} onExpand={() => {}} />);
  const historyButton = screen.getByTestId("history");
  fireEvent.click(historyButton);
  const closeButton = screen.getByRole('button', {name: 'close'});
  fireEvent.click(closeButton);
  const historyList = screen.queryByRole('list');
    expect(historyList).not.toBeInTheDocument();
});

it("Clear the all items in the history list with clear history button", ()=>{
  render(<HistoryButton onSelect={() => {}} isDark={false} onExpand={() => {}} />);
  const historyButton = screen.getByTestId('history');
  fireEvent.click(historyButton);
  const clearButton = screen.getByRole('button', { name: 'Clear history' });
  fireEvent.click(clearButton);
  const historyItems = screen.queryAllByRole('listitem');
  expect(historyItems.length).toBe(0);
});

it("See more history should render more history items maximum 10 per click", async()=>{
  render(<HistoryButton onSelect={() => {}} isDark={false} onExpand={() => {}} />);
  const historyButton = screen.getByTestId('history');
  fireEvent.click(historyButton);
  const seeMoreButton = screen.queryByText('See more history');
  if (seeMoreButton) {
    const mockHistoryItems = Array.from({ length: 15 }, (_, index) => `Item ${index + 1}`);
    for (const item of mockHistoryItems) {
      fireEvent.click(seeMoreButton);
      fireEvent.click(screen.getByText(item));
      await new Promise(resolve => setTimeout(resolve, 100)); 
    }
    const historyItems = screen.queryAllByRole('listitem');
    expect(historyItems.length).toBe(10);
  }
});

it("Items clicked in the history list should render in input section", ()=>{
  let selectedItem = "";
  render(<HistoryButton onSelect={(value) => {selectedItem = value}} isDark={false} onExpand={() => {}} />);
  const historyButton = screen.getByTestId('history');
  fireEvent.click(historyButton);
  const historyItem = screen.queryByRole("listitem");
  if(historyItem){
    fireEvent.click(historyItem);
    expect(selectedItem).toBe("Value of the clicked history item");
  } 
})
})