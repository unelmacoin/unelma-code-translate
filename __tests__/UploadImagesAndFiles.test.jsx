import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import UploadImagesAndFiles from "../components/UploadImagesAndFiles";

describe("UploadImagesAndFiles", ()=>{
  it("renders upload buttons correctly", () => {
    render(<UploadImagesAndFiles onUpload={() => {}} />);
    const imageButton = screen.getByTitle("Upload an image to translate your code");
    const fileButton = screen.getByTitle("Upload a file to translate your code");
    expect(imageButton).toBeInTheDocument();
    expect(fileButton).toBeInTheDocument();
  });

  it("Upload the images correctly when the image icon is clicked", ()=>{
    const imageUploadHandler = jest.fn();
    render(<UploadImagesAndFiles onUpload={imageUploadHandler} />);
    const imageFile = new File(['image'], 'image.png', { type: 'image/png' });
    const input = screen.getByTestId('image-input');
    fireEvent.change(input, { target: { files: [imageFile] } });
    expect(imageUploadHandler).toHaveBeenCalledWith(imageFile);
  });

  it("uploads files correctly with the file icon", () => {
    const fileUploadHandler = jest.fn();
    render(<UploadImagesAndFiles onUpload={fileUploadHandler} />);
    const file = new File(['content'], 'file.txt', { type: 'text/plain' });
    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });
    expect(fileUploadHandler).toHaveBeenCalledWith([file]);
  });

  it("handles invalid file types", () => {
    const fileUploadHandler = jest.fn();
    render(<UploadImagesAndFiles onUpload={fileUploadHandler} />);
    const invalidFile = new File(['content'], 'file.exe', { type: 'application/x-msdownload' });
    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [invalidFile] } });
    expect(fileUploadHandler).not.toHaveBeenCalled();
  });

  it("handles multiple file uploads", () => {
    const fileUploadHandler = jest.fn();
    render(<UploadImagesAndFiles onUpload={fileUploadHandler} />);
    const files = [
      new File(['content1'], 'file1.txt', { type: 'text/plain' }),
      new File(['content2'], 'file2.txt', { type: 'text/plain' }),
    ];
    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files } });
    expect(fileUploadHandler).toHaveBeenCalledWith(files);
  });

  it("checks the state after a successful upload", () => {
    const fileUploadHandler = jest.fn();
    render(<UploadImagesAndFiles onUpload={fileUploadHandler} />);
    const file = new File(['content'], 'file.txt', { type: 'text/plain' });
    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });
    expect(fileUploadHandler).toHaveBeenCalledWith([file]);
    expect(screen.getByText('Upload successful')).toBeInTheDocument();
  });
});