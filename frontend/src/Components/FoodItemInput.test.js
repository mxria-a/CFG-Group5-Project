import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/userevent";
import GetItem from "./GetItem"; 

//create user and mock function
test("renders autocomplete and selects an option", async () => {
    const user = userEvent.setup();
    const setItem = jest.fn();

//load react component 
render(<GetItem item="" setItem={setItem} />);

//find input field where user types
const input = screen.getByLabelText(/what are you craving/i); 


})