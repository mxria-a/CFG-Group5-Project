# **Pickier** - A food delivery app done differently

## Live Demo

Frontend: [Picker.com](https://cfg-group5-project.vercel.app/)

Backend API: https://cfg-group5-backend.onrender.com

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

## Technologies Used

### Frontend
- React
- React Router
- Material UI
- CSS

### Backend
- Node.js
- Express.js
- MySQL
- REST API

### Deployment
- Vercel (Frontend)
- Render (Backend)
- Aiven (MySQL Database)

---

## How to install and run this project

This project requires Node.js to run locally. All additional dependencies can be installed after cloning the repository.

### 1. Clone the repository

```bash
git clone https://github.com/mxria-a/CFG-Group5-Project

cd CFG-Group5-Project
```

### 2. Install dependencies

Install the required packages for both the frontend and backend.

Frontend:

    cd frontend
    npm install

Backend:

    cd backend
    npm install

### 3. Set up the database

This project uses a MySQL database.

- Open the `backend/database/setup.sql` file in MySQL and run the script to create the required database tables.
- Copy the `backend/sample.env` file and create your own `.env` file inside the backend folder.
- Add your MySQL database connection details to the `.env` file.

### 4. Run the application locally

Start the backend server:

```bash
cd backend
npm start 
```


The backend will run on:

    http://localhost:3001

Start the frontend React application:

```bash
cd frontend
npm start
```

The frontend will run on:

    http://localhost:3000

### 5. API integration

The postcode API used by this project does not require an API key, so no additional setup is required.

---

## How to use this project

- Once the React app has been started, the user can move through the interface, simulating the experience of ordering a takeaway
- Currently, the restaurants in the database are only in London, so it will only return items for London postcodes
- The item search is limited to the options in the drop-down menu as this is just a prototype product

## Testing

- Tests for this project are written for testing with Jest. Frontend tests use The React Testing Library
- Tests need to be performed in the frontend and backend of the project separately
  - Frontend testing
    ```bash
    cd frontend
    NPM test
    ```
  - Backend testing
    ```bash
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
