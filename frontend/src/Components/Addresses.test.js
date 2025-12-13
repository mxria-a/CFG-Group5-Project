import { render, screen, fireEvent } from "@testing-library/react";
import Addresses from "./Addresses";

describe("Addresses Component", () => {
  
    test("renders heading and labels", () => {
      render(<Addresses />);
      
      expect(screen.getByText("Addresses")).toBeInTheDocument();
      expect(screen.getByText(/Home/i)).toBeInTheDocument();
      expect(screen.getByText(/Work/i)).toBeInTheDocument();
    });
  
    test("inputs have initial values", () => {
      render(<Addresses />);
  
      expect(screen.getByDisplayValue("123 London Road, SW12 3JW")).toBeInTheDocument();
      expect(screen.getByDisplayValue("456 London Road, EN3 2SW")).toBeInTheDocument();
    });
  
    test("updates input values on user typing", () => {
      render(<Addresses />);
  
      const homeInput = screen.getByDisplayValue("123 London Road, SW12 3JW");
      const workInput = screen.getByDisplayValue("456 London Road, EN3 2SW");
  
      fireEvent.change(homeInput, { target: { value: "789 New Home St" } });
      fireEvent.change(workInput, { target: { value: "101 New Work Rd" } });
  
      expect(homeInput.value).toBe("789 New Home St");
      expect(workInput.value).toBe("101 New Work Rd");
    });
  
  });
  