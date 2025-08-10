import { useContext, useState } from "react";
import { CgMenuMotion } from "react-icons/cg";
import { RiMenuAddLine } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPageLoad, setisPageLoad] = useState(false);

  const menu = [
    { name: "Home", path: "/" },
    { name: "Available Foods", path: "/available-foods" },
    { name: "Add Food", path: "/add-food", private: true },
    { name: "Manage My Foods", path: "/manage-foods", private: true },
    { name: "My Food Request", path: "/my-requests", private: true },
  ];

  const filteredMenu = menu.filter(item => !item.private || user);

  return (
    <nav className="overflow-x-clip">
      {user && (
        <p className="text-center bg-gradient-to-r from-teal-500 to-blue-600 text-white py-1 bg-opacity-90">
          Welcome {user?.displayName} ❤️‍🔥. Now You Can Manage Your Foods 🍉🍉
        </p>
      )}
      <div className="w-11/12 mx-auto py-5 h-14 flex justify-between items-center relative">
        <Link to="/" className="logo">
          <span className="text-3xl font-bold text-stone-700">
            🍅 FoodSharing
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-5 font-medium">
          {filteredMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "text-orange-500 font-semibold" : "text-black"
              }
            >
              {item.name}
            </NavLink>
          ))}

          {user ? (
            <>
              <button onClick={logOut} className="ml-3 text-red-500">
                Logout
              </button>
              <img
                src={user?.photoURL}
                alt="profile"
                className="w-10 h-10 rounded-full ml-3"
                title={user?.displayName}
              />
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/registration">Register</NavLink>
            </>
          )}
        </ul>

        {/* Mobile Nav */}
        <div className="lg:hidden">
          {!isMenuOpen ? (
            <RiMenuAddLine
              onClick={() => {
                setIsMenuOpen(true);
                setisPageLoad(true);
              }}
              className="text-2xl cursor-pointer"
            />
          ) : (
            <CgMenuMotion
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl cursor-pointer"
            />
          )}

          <ul
            className={`flex animate__animated bg-white flex-col lg:hidden gap-5 absolute z-50 bg-opacity-70 w-full top-14 left-0 ${
              isMenuOpen
                ? "animate__fadeInRight"
                : isPageLoad
                ? "animate__fadeOutRight flex"
                : "hidden"
            }`}
          >
            {filteredMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="border-b-2 px-4 py-2 hover:border-orange-500 transition duration-200"
              >
                {item.name}
              </NavLink>
            ))}
            {user ? (
              <>
                <button onClick={logOut} className="text-red-500 px-4 py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/registration">Register</NavLink>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
