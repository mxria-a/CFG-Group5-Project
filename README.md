# **Pickier** - A food delivery app done differently

## Project description

This repo contains the components for a food-delivery app, built using React. This is a group project for the CFG degree to utilise and demonstrate our React and JavaScript skills.

We have built a prototype for a food delivery app, where users can search for items, instead of cuisines or restaurants. The tool's USP is a comparison page, which allows takeaway lovers to compare similar items from different restaurants. This tool was built with dietary requirements and allergies in mind, allergens can be compared up front between specific items, allowing the user to select the most suitable item for them.

## Project features

1. A search tool that finds a specific dish in a database of items
2. Location filtering that filters search items by a set radius from the user postcode
3. Item comparison, allowing comparison of 3 items to inspect calories, rating, allergens, price etc.
4. Basket where users can add items to cart
5. Checkout to complete the order and post to database
6. Customer profile, where users can view their personal information and past orders

## How to install and run this project

- This tool requires node.js to run, all additional dependencies can be installed after cloning the project
- To run the project:

  ```
  git clone https://github.com/mxria-a/CFG-Group5-Project
  cd Group-5-project.git
  ```

- Run npm install in backend and frontend to install the required packages

  ```
  cd frontend
  npm install
  ```

  ```
  cd backend
  npm install
  ```

- Set up the database:

  - Open the `backend -> database -> setup.sql` file in MySQL and run the file to set up the database
  - clone the sample.env file in backend to create your own .env file in backend and add your MySQL details

- Run the app

  - Backend - start the server - runs on `http://localhost:3001`
    ```
    cd backend
    npm start
    ```
  - Frontend - start the React app - runs on `http://localhost:3000`
    ```
    cd frontend
    npm start
    ```

- API integration: the postcode API used does not have a key - no setup needed

## How to use this project

- Once the React app has been started, the user can move through the interface, simulating the experience of ordering a takeaway
- Currently, the restaurants in the database are only in London, so it will only return items for London postcodes
- The item search is limited to the options in the drop-down menu as this is just a prototype product

## Testing

- Tests for this project are written for testing with Jest. Frontend tests use The React Testing Library
- Tests need to be performed in the frontend and backend of the project separately
  - Frontend testing
    ```
    cd frontend
    NPM test
    ```
  - Backend testing
    ```
    cd backend
    NPM test
    ```

## Credits

This tool was built as part of a group project for the CFG degree. It was built by:

- Chantelle - @ChanBailey
- Ellie - @Hargroid
- Jess - @JessBranch25
- Jescintha - @JescinthaRajkumar12
- Maria - @mxria-a
- Temi - @Temioye
- Mariam - Mariamd06

## Licence

This project is licensed under the MIT licence
