import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import ScorePage from "./pages/Score/Score";
import NotFound from "./pages/NotFound/NotFound";
import ActivityPage from "./pages/Activity/Activity";
import { ActivityProvider } from "./context/ActivityProvider";

function App() {
  return (
    // Provides quiz activity context to the entire app
    <ActivityProvider>
      {/* Sets up client-side routing */}
      <Router>
        <div>
          <Routes>
            {/* Home page route */}
            <Route path="/" element={<Home />} />

            {/* Score page route */}
            <Route path="/score" element={<ScorePage />} />

            {/* Dynamic route for activity pages, e.g., /activity/Activity One */}
            <Route path="/activity/:name" element={<ActivityPage />} />

            {/* Catch-all route for handling 404 pages */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ActivityProvider>
  );
}

export default App;
