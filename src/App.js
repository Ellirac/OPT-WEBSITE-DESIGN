import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Home       from "./pages/Home";
import Company    from "./pages/About";
import Products   from "./pages/Products";
import Careers    from "./pages/Careers";
import Contact    from "./pages/Contact";
import Activities from "./pages/Activities";
import ScrollToTop from "./components/ScrollToTop";
import AdminApp   from "./admin/AdminApp";

// Single CMSProvider wraps everything — public pages + admin share the same store
import { CMSProvider } from "./admin/context/CMSContext";

function PublicSite() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/about"      element={<Company />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/careers"    element={<Careers />} />
        <Route path="/contact"    element={<Contact />} />
        <Route path="/products"   element={<Products />} />
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
          {/* Admin panel — no Header/Footer */}
          <Route path="/admin/*" element={<AdminApp />} />
          {/* Public website */}
          <Route path="/*" element={<PublicSite />} />
        </Routes>
      </BrowserRouter>
    </CMSProvider>
  );
}

export default App;
