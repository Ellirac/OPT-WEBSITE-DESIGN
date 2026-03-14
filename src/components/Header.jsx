import { Link, useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import logo from "../assets/images/opt_logo2.png";

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
    <>
      <style>{`
        /* ── Navbar shell: always transparent ── */
        .navbar-main {
          background-color: transparent !important;
          box-shadow: none !important;
          transition: padding 0.4s ease;
          padding-top: 18px;
          padding-bottom: 18px;
        }

        /* ── The floating pill that wraps only the links ── */
        .nav-pill {
          transition: background 0.4s ease,
                      box-shadow 0.4s ease,
                      border-radius 0.4s ease,
                      padding 0.4s ease;
          padding: 6px 12px;
          border-radius: 0px;
        }

        .nav-pill.pill-active {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
          border-radius: 50px;
          padding: 8px 28px;
        }

        /* ── Link styles ── */
        .nav-link-animated {
          position: relative;
          padding: 6px 4px !important;
          padding-bottom: 6px !important;
          color: #4b87ae !important;
          font-size: 1rem !important;
          letter-spacing: 0.04em;
          transition: color 0.3s ease;
          white-space: nowrap;
        }

        /* Once pill is active, links go dark */
        .pill-active .nav-link-animated {
          color: #1a1a1a !important;
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

        /* spacing between each nav item */
        .navbar-nav .nav-item {
          margin: 0 6px;
        }

        /* ── Logo drop shadow so it shows on any bg ── */
        .navbar-logo {
          filter: drop-shadow(0 1px 4px rgba(0,0,0,0.35));
          transition: filter 0.3s ease;
        }

        /* ── Mobile fallback ── */
        @media (max-width: 991px) {

          /* Navbar itself stays fully transparent */
          .navbar-main {
            background-color: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            padding-top: 10px;
            padding-bottom: 10px;
          }

          /* Only the dropdown links area gets the gray background */
          #mainNav {
            background-color: rgba(0, 0, 0, 0.55) !important;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 12px;
            margin-top: 8px;
            padding: 12px 16px;
          }

          .nav-pill,
          .nav-pill.pill-active {
            background: transparent !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            backdrop-filter: none !important;
          }

          .nav-link-animated {
            color: #ffffff !important;
            font-size: 1.05rem !important;
          }

          .pill-active .nav-link-animated {
            color: #ffffff !important;
          }

          .navbar-nav .nav-item {
            margin: 4px 0;
            width: 100%;
          }
        }
      `}</style>

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
    </>
  );
};

export default Header;