import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CodeBlock } from '../components/CodeBlock';

// Mock CodeMirror component
jest.mock('@uiw/react-codemirror', () => {
  const MockCodeMirror = (props) => {
    return <textarea data-testid="code" value={props.value} onChange={(e) => props.onChange(e.target.value)} />;
  };
  MockCodeMirror.displayName = 'MockCodeMirror';
  return MockCodeMirror;
});

describe('CodeBlock', () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default code correctly on mount', () => {
    render(<CodeBlock code="" isDark={false} />);
    const codeBlockElement = screen.getByTestId('code');
    expect(codeBlockElement).toBeInTheDocument();
  });

  it('renders code passed as a prop', () => {
    const code = 'const a = 1;';
    render(<CodeBlock code={code} isDark={false} />);
    const codeBlockElement = screen.getByTestId('code');
    expect(codeBlockElement).toHaveValue(code);
  });

  it('copies to the clipboard when the copy button is clicked', async () => {
    render(<CodeBlock code="const a = 1;" isDark={false} />);
    const copyButton = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(copyButton);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const a = 1;');
    await act(async () => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('handles errors during copy to clipboard', async () => {
    const clipboardCopy = jest.fn().mockImplementation(() => {
      throw new Error('Copy failed');
    });
    global.navigator.clipboard = {
      writeText: clipboardCopy,
    };
    render(<CodeBlock code="const a = 1;" isDark={false} />);
    const copyButton = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(copyButton);
    });
    expect(clipboardCopy).toHaveBeenCalled();
    await act(async () => {
      expect(screen.getByText('Copy failed')).toBeInTheDocument();
    });
  });
});