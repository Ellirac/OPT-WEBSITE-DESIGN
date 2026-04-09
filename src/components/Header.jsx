import { Link, useLocation, } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import logo from "../assets/images/opt_logo2.png";
import "../styles/Header.css";

const PRODUCT_ITEMS = [
  { label: "Automobile Products",       path: "/products/automobile" },
  { label: "Rubber Parts for Motorcycle", path: "/products/motorcycle" },
];

const Header = () => {
  const navRef   = useRef(null);
  const location = useLocation();
  const [scrolled,     setScrolled]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropTimer = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClose = () => {
    const toggler    = document.querySelector(".navbar-toggler");
    const navCollapse = navRef.current;
    if (navCollapse && navCollapse.classList.contains("show")) toggler?.click();
  };

  const handleNavClick = (path) => {
    handleNavClose();
    setDropdownOpen(false);
    if (location.pathname === path) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isProductActive = location.pathname.startsWith("/products");

  // Dropdown hover handlers with small delay to prevent flicker
  const openDrop  = () => { clearTimeout(dropTimer.current); setDropdownOpen(true); };
  const closeDrop = () => { dropTimer.current = setTimeout(() => setDropdownOpen(false), 120); };

  const navLinks = [
    { label: "Home",       path: "/" },
    { label: "About Us",   path: "/about" },
    { label: "Activities", path: "/activities" },
    { label: "Careers",    path: "/careers" },
    { label: "Contact",    path: "/contact" },
  ];

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-main">
      <div className="container-fluid d-flex justify-content-between align-items-center px-4">

        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={() => handleNavClick("/")}>
          <img src={logo} alt="Ohtsuka Poly-Tech Philippines" height="65" className="navbar-logo" />
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

        {/* Nav links */}
        <div className="collapse navbar-collapse justify-content-end" id="mainNav" ref={navRef}>
          <div className={`nav-pill d-flex align-items-center ${scrolled ? "pill-active" : ""}`}>
            <ul className="navbar-nav d-flex flex-column flex-lg-row align-items-start align-items-lg-center mb-0">

              {/* Home */}
              <li className="nav-item">
                <Link className={`nav-link fw-semibold nav-link-animated ${isActive("/") && location.pathname === "/" ? "active-link" : ""}`}
                  to="/" onClick={() => handleNavClick("/")}>Home</Link>
              </li>

              {/* About Us */}
              <li className="nav-item">
                <Link className={`nav-link fw-semibold nav-link-animated ${isActive("/about") ? "active-link" : ""}`}
                  to="/about" onClick={() => handleNavClick("/about")}>About Us</Link>
              </li>

              {/* Products — dropdown */}
              <li
                className="nav-item nav-dropdown-wrap"
                onMouseEnter={openDrop}
                onMouseLeave={closeDrop}
              >
                {/* Desktop: the text "Products" is clickable and navigates to automobile */}
                <Link
                  className={`nav-link fw-semibold nav-link-animated nav-link-products ${isProductActive ? "active-link" : ""}`}
                  to="/products/automobile"
                  onClick={() => handleNavClick("/products/automobile")}
                >
                  Products
                  <span className="products-caret" aria-hidden="true">▾</span>
                </Link>

                {/* Mobile: inline submenu */}
                <div className="nav-dropdown-mobile d-lg-none">
                  {PRODUCT_ITEMS.map(item => (
                    <Link key={item.path} className={`nav-sub-link ${isActive(item.path) ? "active-link" : ""}`}
                      to={item.path} onClick={() => handleNavClick(item.path)}>
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Desktop: hover dropdown panel */}
                {dropdownOpen && (
                  <div className="nav-dropdown-panel" onMouseEnter={openDrop} onMouseLeave={closeDrop}>
                    {PRODUCT_ITEMS.map(item => (
                      <Link
                        key={item.path}
                        className={`nav-dropdown-item ${isActive(item.path) ? "active" : ""}`}
                        to={item.path}
                        onClick={() => handleNavClick(item.path)}
                      >
                        <span className="nav-dropdown-dot" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>

              {/* Activities, Careers, Contact */}
              {navLinks.slice(2).map(({ label, path }) => (
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