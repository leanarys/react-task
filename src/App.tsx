import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import ScorePage from "./pages/Score/Score";
import NotFound from "./pages/NotFound/NotFound";
import ActivityPage from "./pages/Activity/Activity";
import { ActivityProvider } from "./context/ActivityProvider";
function App() {
  return (
    <ActivityProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/score" element={<ScorePage />} />
            <Route path="/activity/:name" element={<ActivityPage />} />
            <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
          </Routes>
        </div>
      </Router>
    </ActivityProvider>
  );
}

export default App;
