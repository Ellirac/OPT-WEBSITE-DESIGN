import { Link, } from "react-router-dom";
import { useRef } from "react";
import logo from "../assets/images/opt_logo2.png";

const Header = () => {
  const navRef = useRef(null);

  const handleNavClose = () => {
    const toggler = document.querySelector(".navbar-toggler");
    const navCollapse = navRef.current;

    if (navCollapse && navCollapse.classList.contains("show")) {
      toggler?.click();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center px-4">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={handleNavClose}>
          <img
            src={logo}
            alt="Ohtsuka Poly-Tech Philippines"
            height="70"
          />
        </Link>

        {/* Hamburger toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="mainNav" ref={navRef}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/" onClick={handleNavClose}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/about" onClick={handleNavClose}>About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/products" onClick={handleNavClose}>Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/activities" onClick={handleNavClose}>Activities</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/careers" onClick={handleNavClose}>Careers</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/contact" onClick={handleNavClose}>Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;