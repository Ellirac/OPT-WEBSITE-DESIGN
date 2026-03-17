import { Link, useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import logo from "../assets/images/opt_logo2.png";
import "../styles/Header.css";

const Header = () => {
  const navRef = useRef(null);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (path) => {
    handleNavClose();
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavClose = () => {
    const toggler = document.querySelector(".navbar-toggler");
    const navCollapse = navRef.current;
    if (navCollapse && navCollapse.classList.contains("show")) {
      toggler?.click();
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Products", path: "/products" },
    { label: "Activities", path: "/activities" },
    { label: "Careers", path: "/careers" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-main">
      <div className="container-fluid d-flex justify-content-between align-items-center px-4">

        {/* Logo — always floating, no background */}
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          onClick={() => handleNavClick("/")}
        >
          <img
            src={logo}
            alt="Ohtsuka Poly-Tech Philippines"
            height="65"
            className="navbar-logo"
          />
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ filter: "invert(1)" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links wrapped in the floating pill */}
        <div className="collapse navbar-collapse justify-content-end" id="mainNav" ref={navRef}>
          <div className={`nav-pill d-flex align-items-center ${scrolled ? "pill-active" : ""}`}>
            <ul className="navbar-nav d-flex flex-column flex-lg-row align-items-start align-items-lg-center mb-0">
              {navLinks.map(({ label, path }) => (
                <li className="nav-item" key={path}>
                  <Link
                    className={`nav-link fw-semibold nav-link-animated ${isActive(path) ? "active-link" : ""}`}
                    to={path}
                    onClick={() => handleNavClick(path)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Header;