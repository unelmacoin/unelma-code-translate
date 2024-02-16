import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import {ModelSelect} from "../components/ModelSelect";

describe("ModelSelect", () => {
  const initialModel = "gpt-3.5-turbo";

  it("renders with the initial model correctly", () => {
    render(
      <ModelSelect
        model={initialModel}
        onChange={jest.fn()}
        isDark={false}
      />
    );
    expect(screen.getByRole('combobox')).toHaveValue(initialModel);
  });

  it("handles model change", () => {
    const handleChange = jest.fn();
    render(
      <ModelSelect
        model={initialModel}
        onChange={handleChange}
        isDark={false}
      />
    );
    const selectModel = screen.getByRole("combobox");
    fireEvent.change(selectModel, { target: { value: "gpt-4" } });
    expect(handleChange).toHaveBeenCalledWith("gpt-4");
  });
});
