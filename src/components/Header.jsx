import { Link, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import logo from "../assets/images/opt_logo2.png";

const Header = () => {
  const navRef = useRef(null);
  const location = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const handleNavClick = (path) => {
    handleNavClose();
    // If already on the same page, force scroll to top
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
    <>
      <style>{`
        .nav-link-animated {
          position: relative;
          padding-bottom: 4px !important;
          color: #222 !important;
          transition: color 0.3s ease;
        }

        .nav-link-animated::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          background-color: #d32f2f;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .nav-link-animated:hover::after,
        .nav-link-animated.active-link::after {
          width: 100%;
        }

        .nav-link-animated.active-link {
          color: #d32f2f !important;
        }

        .nav-link-animated:hover {
          color: #d32f2f !important;
        }

        /* Mobile: underline below text */
        @media (max-width: 991px) {
          .nav-link-animated::after {
            bottom: 2px;
          }
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center px-4">
          <Link
            className="navbar-brand d-flex align-items-center"
            to="/"
            onClick={() => handleNavClick("/")}
          >
            <img src={logo} alt="Ohtsuka Poly-Tech Philippines" height="70" />
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
              {navLinks.map(({ label, path }) => (
                <li className="nav-item" key={path}>
                  <Link
                    className={`nav-link fw-bold nav-link-animated ${isActive(path) ? "active-link" : ""}`}
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
      </nav>
    </>
  );
};

export default Header;