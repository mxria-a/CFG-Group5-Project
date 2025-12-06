import "./App.css";
import Home from "./Pages/Homepage";
import TeamIntro from "./Components/TeamIntro"; 

function App() {
  return (
    <div className="App">
      {/* The Main App Logic */}
      <Home />
      
      {/* Spacing */}
      <div style={{ height: '80px' }}></div>
      
      {/* The Team Section */}
      <TeamIntro />
      
    </div>
  );
}

export default App;