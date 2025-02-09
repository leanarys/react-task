import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import HomeScreen from "./pages/home";

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

const Home111: React.FC = () => (
  <div>
    <h1>Home Screen1111</h1>
    <p>Welcome to the home page.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="*" element={<HomeScreen />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/new" element={<Home111 />} />
      </Routes>
    </div>
  );
};
export default App;
