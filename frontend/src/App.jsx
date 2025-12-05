import "./App.css";
import Home from "./Pages/Homepage";
import TeamIntro from "./Components/TeamIntro"; // Import the new component

function App() {
  return (
    <div className="App">
      {/* The Main App Logic */}
      <Home />
      
      {/* Spacing */}
      <div style={{ height: '80px' }}></div>
      
      {/* The Team Section (Clean and separate) */}
      <TeamIntro />
      
    </div>
  );
}

export default App;