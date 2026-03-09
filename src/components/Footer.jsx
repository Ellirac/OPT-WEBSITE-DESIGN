const Footer = () => {
  return (
    <footer className="bg-light py-4 mt-5">
      <div className="container text-center">
        <p className="mb-1 fw-bold">
          <span className="text-danger">OHTSUKA</span> Poly-Tech Philippines, Inc.
        </p>
        <small>© {new Date().getFullYear()} All Rights Reserved</small>
      </div>
    </footer>
  );
};

export default Footer;
