import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";
import Button from "./Button";

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  const getLinkClass = (path, isMobile = false) => {
    const isActive =
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path);

    if (isMobile) {
      return `block px-3 py-2 rounded-md transition-colors ${
        isActive
          ? "bg-primary-dark font-bold text-white"
          : "text-blue-100 hover:bg-blue-700 hover:text-white"
      }`;
    }

    return `transition-all flex items-center gap-1 py-1 ${
      isActive
        ? "text-white font-bold border-b-2 border-white"
        : "text-blue-100 hover:text-white border-b-2 border-transparent"
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b text-slate-700 border-slate-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-2xl rounded-lg bg-buttonBlue lg:h-10 lg:w-10">
              <img src="/logo-no-bg.png" alt="logo" />
            </div>
            <span className="text-xl text-textBlue font-bold tracking-[-0.4px] text-[var(--text-h)] md:text-xl">
              MediQueue
            </span>
          </Link>

          <div className="items-center hidden space-x-8 font-medium md:flex">
            <Link to="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/about" className="transition-colors hover:text-primary">
              About
            </Link>
            <Link to="/services" className="transition-colors hover:text-primary">
              Services
            </Link>
            <Link to="/contact" className="transition-colors hover:text-primary">
              Contact
            </Link>
            <Link to="/faq" className="transition-colors hover:text-primary">
              FAQ
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1 transition-colors hover:text-primary"
                >
                  <User size={18} />
                  Dashboard
                </Link>

                {user.role === "patient" && (
                  <Link
                    to="/book"
                    className="px-5 py-2 font-medium transition-colors rounded-md btn-primary"
                  >
                    Book Appointment
                  </Link>
                )}

                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-1 transition-colors text-slate-500 hover:text-red-500"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  to="/login"
                  className="px-6 py-2 font-medium transition-colors bg-transparent border rounded-md text-primary border-primary hover:bg-blue-50"
                >
                  Login
                </Button>
                <Button
                  to="/register"
                  className="px-6 py-2 font-medium text-white transition-colors rounded-md shadow-sm cursor-pointer bg-buttonBlue hover:bg-primary-dark"
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 transition-colors rounded-md hover:bg-primary-dark hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`border-t border-blue-400 md:hidden bg-primary-dark overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" onClick={toggleMenu} className={getLinkClass("/", true)}>
            Home
          </Link>
          <Link
            to="/queue"
            onClick={toggleMenu}
            className={getLinkClass("/queue", true)}
          >
            Live Queue
          </Link>
          <Link
            to="/faq"
            onClick={toggleMenu}
            className={getLinkClass("/faq", true)}
          >
            FAQ
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={toggleMenu}
                className={getLinkClass("/dashboard", true)}
              >
                Dashboard
              </Link>

              {user.role === "patient" && (
                <Link
                  to="/book"
                  onClick={toggleMenu}
                  className={getLinkClass("/book", true)}
                >
                  Book Appointment
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogoutClick();
                  toggleMenu();
                }}
                className="block w-full px-3 py-2 font-medium text-left text-blue-100 transition-colors rounded-md hover:bg-blue-700 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={toggleMenu}
                className={getLinkClass("/login", true)}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className={getLinkClass("/register", true)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;