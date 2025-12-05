// import logo from './logo.svg';
import "./App.css";
import FoodComparisonPage from './Components/FoodComparisonPage.js';
import Home from "./Pages/Homepage";

function App() {
  return (
    <div className="App">
      <FoodComparisonPage />
      <header className="App-header">
        <h1 className="Introductions-header">Team Introductions</h1>
        <h2 className="Teammate-name">Maria</h2>
        <p>
          <b>Favourite hobby:</b> Binging reality shows
        </p>
        <p>
          I do this because it's my favourite thing to do apart from sleeping
        </p>
        <div className="divider"></div>

        <h2 className="Teammate-name">Jescintha Rajkumar</h2>
        <p>
          <b>Favourite hobby:</b> Reading
        </p>
        <p>
          I love reading as a student of literature and language, exploring
          diverse narratives and linguistic structures.
        </p>
        <div className="divider"></div>
        <h2 className="Teammate-name">Jess</h2>
        <p>
          <b>Favourite hobby:</b> Cycling
        </p>
        <p>
          I love being outside: cycling, walking, running. But I also love
          watching trash TV on the sofa.
        </p>
        <div className="divider"></div>


        <h2 className="Teammate-name">Chantelle</h2>
        <p>
          <b>Favourite hobby:</b> Sports and activities
        </p>
        <p>
          &#127952; I play and coach netball and love being active! &#127952; 
        </p>
        <div className="divider"></div>

        <h2 className="Teammate-name">Temi</h2>
        <p>
          <b>Favourite hobby:</b> Gym & Pilates 
        </p>
        <p>
           I love being active, i'm a massive foodie and reality TV is my guilty pleasure!  &#127952; 
        </p>
        <div className="divider"></div>


        <h2 className="Teammate-name">Ellie</h2>
        <p>
          <b>Favourite hobby:</b> Anything active
        </p>
        <p>
          I love going on long solo walks and listening to a good audio book.
        </p>

      </header>
      <Home />
    </div>
  );
}

export default App;
