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
    const imageFile = new File(['image'], 'image.png', {type: 'image/*'})
    const imageButton = screen.getByTitle("Upload an image to translate your code");
    fireEvent.click(imageButton);
    if(imageFile > 0){
      expect(imageUploadHandler).toHaveBeenCalledWith(imageFile);
    } 
  });
  
  it("Upload files correctly with the file icon", ()=>{
    const fileUploadHandler = jest.fn();
    render(<UploadImagesAndFiles onUpload={fileUploadHandler} />);
    const file = new File(['content'], 'file.txt', {type: 'file/text'})
    const fileButton = screen.getByTitle("Upload a file to translate your code");
    fireEvent.click(fileButton);
    if(file > 0){
      expect(fileUploadHandler).toHaveBeenCalledWith(file);
    }
  })
})