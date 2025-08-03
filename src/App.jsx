import { Routes, Route } from 'react-router-dom';
import Landing from "./pages/Landing";
import Dashboard from "./components/dashboard/Dashboard";
import { useToast } from "./components/Toast";
import './App.css'
function App() {
  return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
  );
}

export default App;
