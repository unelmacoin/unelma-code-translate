import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import {ModelSelect} from "../components/ModelSelect";
import { useState } from 'react';

const ModelSelectWrapper = ({ initialModel, isDark }) => {
  const [model, setModel] = useState(initialModel);
  return (
    <ModelSelect
      model={model}
      onChange={setModel}
      isDark={isDark}
    />
  );
};

describe("ModelSelect", () => {
  const initialModel = "gpt-3.5-turbo";

  it("renders with the initial model correctly", () => {
    render(
      <ModelSelectWrapper
        initialModel={initialModel}
        isDark={false}
      />
    );
    expect(screen.getByRole('combobox')).toHaveValue(initialModel);
  });

  it("handles model change", () => {
    render(
      <ModelSelectWrapper
        initialModel={initialModel}
        isDark={false}
      />
    );
    const selectModel = screen.getByRole("combobox");
    fireEvent.change(selectModel, { target: { value: "gpt-4" } });
    expect(selectModel).toHaveValue("gpt-4");
  });

  it("handles invalid model selection", () => {
    const handleChange = jest.fn();
    render(
      <ModelSelect
        model={initialModel}
        onChange={handleChange}
        isDark={false}
      />
    );
    const selectModel = screen.getByRole("combobox");
    fireEvent.change(selectModel, { target: { value: "invalid-model" } });
    expect(handleChange).not.toHaveBeenCalledWith("invalid-model");
  });

  it("checks the state after a model change", () => {
    render(
      <ModelSelectWrapper
        initialModel={initialModel}
        isDark={false}
      />
    );
    const selectModel = screen.getByRole("combobox");
    fireEvent.change(selectModel, { target: { value: "gpt-4" } });
    expect(selectModel).toHaveValue("gpt-4");
  });
});
