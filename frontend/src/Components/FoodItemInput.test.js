import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FoodItemInput from "./FoodItemInput";


//create user and mock function
test("should call setItem with the selected value when an option is clikced", async () => {
    const user = userEvent.setup();
    const setItem = jest.fn();

//load react component 
render(<FoodItemInput  item="" setItem={setItem} />);

//find input field where user types
const input = screen.getByLabelText(/what are you craving/i); 

//activity of opening drop down and selecting option 
await user.click(input); 
await user.click(screen.getByText("Burger"));

expect(setItem).toHaveBeenCalledWith("Burger");
}); 