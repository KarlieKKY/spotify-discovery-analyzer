import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  LandingPage,
  ConnectPage,
  CallbackPage,
  LoadingPage,
  Dashboard,
} from "./pages";

function App() {
  const handleConnect = () => {
    console.log("Connect button clicked!");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage onConnect={handleConnect} />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
