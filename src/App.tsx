import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RegistrationLayout from "./components/RegistrationLayout";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import Records from "./pages/Records"; // <-- NEW IMPORT

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
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/records" element={<Records />} /> {/* <-- NEW ROUTE */}
      </Routes>
    </Router>
  );
}

export default App;