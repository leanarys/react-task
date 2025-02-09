import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import NewScreen from "./screens/sample";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>

//           I'm working late
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const Home: React.FC = () => (
  <div>
    <h1>Home Screen</h1>
    <p>Welcome to the home page.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/new">New Screen</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewScreen />} />
      </Routes>
    </div>
  );
};
export default App;
