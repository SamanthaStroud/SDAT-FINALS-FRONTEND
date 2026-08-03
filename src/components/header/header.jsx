import "./header.css";
import { ActionIcon } from "@mantine/core";
import { Link, useLocation } from "wouter";
import Usericon from "../../assets/Usericon.svg";
import Logo from "../../assets/logo.svg";
import { useAuth } from "../../context/AuthContext";

function Header({ hideNav = false, hideAuth = false }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: "Home", href: "/#top", path: "/" },
    { label: "Topics", href: "/#topics", path: null },
    { label: "Notes", href: "/#notes", path: null },
    { label: "AI Tool", href: "/#ai-tool", path: null },
    { label: "About Us", href: "/#about", path: null },
  ];

  return (
    <header className="headerbox">
      {/* Logo — links back to main page */}
      <div className="titlebox">
        <Link href="/">
          <img
            src={Logo}
            alt="Software Study Scripts"
            className="header-logo"
          />
        </Link>
      </div>

      {/* Navigation pill */}
      {!hideNav && (
        <div className="navbox">
          <nav>
            {navLinks.map(({ label, href, path }) => {
              const isActive = path && location === path;
              return (
                <a
                  key={label}
                  href={href}
                  className={
                    isActive ? "nav-link nav-link--active" : "nav-link"
                  }
                >
                  {label}
                </a>
              );
            })}
          </nav>
        </div>
      )}

      {/* Auth button */}
      {!hideAuth && (
        <div className="signinbtn">
          {user ? (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <Link href="/account">
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    border: "2px solid #a78bfa",
                    background: "rgba(167,139,250,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#a78bfa",
                    fontWeight: "700",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <button className="login-btn">Login / Register</button>
            </Link>
          )}
        </div>
      )}

      {/* Mobile icon */}
      <div className="iconbtn">
        <ActionIcon
          variant="outline"
          size="lg"
          radius="0.75rem"
          className="mobile-icon-btn"
        >
          <img
            src={Usericon}
            alt="Login"
            style={{ width: "90%", height: "90%" }}
          />
        </ActionIcon>
      </div>
    </header>
  );
}

export default Header;
