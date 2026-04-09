import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Home              from "./pages/Home";
import Company           from "./pages/About";
import AutomobileProduct from "./pages/Products/AutomobileProduct";
import MotorProducts     from "./pages/Products/MotorProducts";
import Careers           from "./pages/Careers";
import Contact           from "./pages/Contact";
import Activities        from "./pages/Activities";
import ScrollToTop       from "./components/ScrollToTop";
import AdminApp          from "./admin/AdminApp";

import { CMSProvider } from "./admin/context/CMSContext";

function PublicSite() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/"                       element={<Home />} />
        <Route path="/about"                  element={<Company />} />
        <Route path="/activities"             element={<Activities />} />
        <Route path="/careers"                element={<Careers />} />
        <Route path="/contact"                element={<Contact />} />
        {/* Products: /products → automobile, /products/automobile, /products/motorcycle */}
        <Route path="/products"               element={<Navigate to="/products/automobile" replace />} />
        <Route path="/products/automobile"    element={<AutomobileProduct />} />
        <Route path="/products/motorcycle"    element={<MotorProducts />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <CMSProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*"       element={<PublicSite />} />
        </Routes>
      </BrowserRouter>
    </CMSProvider>
  );
}

export default App;