import { useContext, useEffect, useState } from "react";
import { CgMenuMotion } from "react-icons/cg";
import { RiMenuAddLine } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    let timer;
    if (user) {
      setShowWelcomeMessage(true);
      timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [user]);

  const menu = [
    { name: "Home", path: "/" },
    { name: "Available Foods", path: "/available-foods" },
    { name: "Add Food", path: "/add-food", private: true },
    { name: "Manage My Foods", path: "/manage-foods", private: true },
    { name: "My Food Request", path: "/my-requests", private: true },
  ];

  const filteredMenu = menu.filter((item) => !item.private || user);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      {user && showWelcomeMessage && (
        <p className="text-center bg-blue-600 text-white py-1 bg-opacity-90 animate-pulse">
          Welcome {user?.displayName} ❤️‍🔥. Now You Can Manage Your Foods 🍉
        </p>
      )}
      <div className="w-11/12 mx-auto py-3 flex justify-between items-center">
        <Link to="/" className="logo">
          <span className="text-3xl font-bold text-stone-700">
            🍅 FoodSharing
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-5 font-medium text-black">
          {filteredMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "text-orange-500 font-semibold" : "hover:text-orange-500 transition-colors"
              }
            >
              {item.name}
            </NavLink>
          ))}

          {user ? (
            <>
              <button onClick={logOut} className="ml-3 text-red-500 hover:text-red-700 transition-colors">
                Logout
              </button>
              <img
                src={user?.photoURL}
                alt="profile"
                className="w-10 h-10 rounded-full ml-3 border-2 border-stone-700"
                title={user?.displayName}
              />
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-orange-500 transition-colors">Login</NavLink>
              <NavLink to="/registration" className="hover:text-orange-500 transition-colors">Register</NavLink>
            </>
          )}
        </ul>

        {/* Mobile Nav */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu" className="text-stone-700">
            {!isMenuOpen ? (
              <RiMenuAddLine className="text-2xl cursor-pointer" />
            ) : (
              <CgMenuMotion className="text-2xl cursor-pointer" />
            )}
          </button>
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out lg:hidden ${
              isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={handleLinkClick}
          >
            <ul
              className={`absolute top-0 right-0 w-3/4 bg-white shadow-lg p-5 h-full transform transition-transform duration-300 ease-in-out ${
                isMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {filteredMenu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className="block border-b-2 px-4 py-3 hover:bg-gray-100 transition duration-200"
                >
                  {item.name}
                </NavLink>
              ))}
              {user ? (
                <>
                  <button
                    onClick={() => {
                      logOut();
                      handleLinkClick();
                    }}
                    className="w-full text-left border-b-2 px-4 py-3 text-red-500 hover:bg-gray-100 transition duration-200"
                  >
                    Logout
                  </button>
                  <div className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={user?.photoURL}
                      alt="profile"
                      className="w-10 h-10 rounded-full"
                      title={user?.displayName}
                    />
                    <span>{user?.displayName}</span>
                  </div>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={handleLinkClick} className="block border-b-2 px-4 py-3 hover:bg-gray-100 transition duration-200">
                    Login
                  </NavLink>
                  <NavLink to="/registration" onClick={handleLinkClick} className="block border-b-2 px-4 py-3 hover:bg-gray-100 transition duration-200">
                    Register
                  </NavLink>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;