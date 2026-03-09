import { Link } from "react-router-dom";
import logo from "../assets/images/opt_logo2.png";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center px-4">
        <Link className="navbar-brand d-flex align-items-center" to="/">
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
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/about">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/products">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/activities">Activities</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/careers">Careers</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
