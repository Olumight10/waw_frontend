import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RegistrationLayout from "./components/RegistrationLayout";
import Footer from "./components/Footer"; // Import the Footer component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Hero />
              <RegistrationLayout />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;