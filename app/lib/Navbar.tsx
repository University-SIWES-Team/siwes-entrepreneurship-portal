
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="logo">
          SIWES Portal
        </Link>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link href="/entrepreneurship" onClick={() => setMenuOpen(false)}>
            Entrepreneurship
          </Link>

          <Link href="/resources" onClick={() => setMenuOpen(false)}>
            Resources
          </Link>

          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
        </div>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
      </div>
    </nav>
  );
}