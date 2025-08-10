import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";

const Home = () => {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dynamic & Localized Banner Images for better control and performance/
  const bannerImages = [
    {
      src: "https://i.ibb.co/zVMhwKnV/istockphoto-883729432-612x612.jpg",
      alt: "Community Food Sharing",
      heading: "Nourish Lives, Share Blessings",
      subheading: "Connect with local communities to reduce waste and fight hunger.",
    },
    {
      src: "https://i.ibb.co/SXJtVgBF/istockphoto-1457738274-612x612.jpg",
      alt: "Fresh Produce Donation",
      heading: "Freshness Shared, Hearts Fulfilled",
      subheading: "Donate surplus produce and bring smiles to countless faces.",
    },
    {
      src: "https://i.ibb.co/JjZZgyPv/istockphoto-472165353-612x612.jpg",
      alt: "Community Meal Program",
      heading: "Uniting Through Shared Meals",
      subheading: "Experience the joy of community and make a real difference, one meal at a time.",
    },
    {
      src: "https://i.ibb.co/1JG3zj3L/istockphoto-1457433817-612x612.jpg",
      alt: "Sustainable Food Practices",
      heading: "Zero Waste, Maximum Impact",
      subheading: "Join our movement to reduce food waste and promote sustainable living.",
    },
  ];

  useEffect(() => {
    // Fetch featured foods
    axios.get("https://mission-scic11-server-template-main.vercel.app/available-foods").then((res) => {
      const sorted = res.data
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 6); // top 6
      setFeaturedFoods(sorted);
    });

    // Auto-slide for banner
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval); // Cleanup interval on component unmount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewDetails = (id) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/food/${id}`);
    }
  };

  // Framer Motion variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const bannerVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    }),
  };

  const paginate = (newDirection) => {
    setCurrentSlide((prev) => {
      const nextIndex = (prev + newDirection + bannerImages.length) % bannerImages.length;
      return nextIndex;
    });
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative h-[80vh] overflow-hidden" // Increased height, added overflow hidden for slider
      >
        <AnimatePresence initial={false} custom={currentSlide}>
          <motion.div
            key={currentSlide}
            custom={currentSlide}
            variants={bannerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 bg-cover bg-center flex items-center justify-center text-white"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${bannerImages[currentSlide].src})`,
            }}
          >
            <div className="text-center p-8 max-w-3xl mx-auto z-10">
              <h1 className="text-6xl font-extrabold mb-4 leading-tight">
                <motion.span
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {bannerImages[currentSlide].heading}
                </motion.span>
              </h1>
              <p className="text-xl leading-relaxed">
                <motion.span
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {bannerImages[currentSlide].subheading}
                </motion.span>
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-lg mt-8 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/available-foods")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Explore Available Foods
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {bannerImages.map((_, idx) => (
            <motion.div
              key={idx}
              className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
                idx === currentSlide ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => setCurrentSlide(idx)}
              whileHover={{ scale: 1.2 }}
            ></motion.div>
          ))}
        </div>
        <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20">
          <motion.button
            onClick={() => paginate(-1)}
            className="text-white text-4xl p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            &#x2039;
          </motion.button>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20">
          <motion.button
            onClick={() => paginate(1)}
            className="text-white text-4xl p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            &#x203A;
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="max-w-7xl mx-auto p-5 mt-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4 md:mb-0">
            🍱 Featured Foods
          </h2>
          <Link to="/available-foods">
            <motion.button
              className="btn btn-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-none rounded-full px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Foods
            </motion.button>
          </Link>
        </div>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={sectionVariants} // Reuse section variants for stagger effect
        >
          {featuredFoods.map((food) => (
            <motion.div
              key={food._id}
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
              }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md flex flex-col h-full"
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-6 flex-grow">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {food.name}
                </h3>
                <p className="text-gray-600 text-lg mb-1">
                  <span className="font-semibold">Quantity:</span>{" "}
                  {food.quantity}
                </p>
                <p className="text-gray-600 text-lg mb-4">
                  <span className="font-semibold">Pickup Location:</span>{" "}
                  {food.location}
                </p>
                <motion.button
                  onClick={() => handleViewDetails(food._id)}
                  className="btn btn-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-none rounded-lg px-6 py-3 text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Extra Section 1 */}
      <motion.div
        className="bg-gradient-to-br from-purple-100 to-pink-100 py-20 mt-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto text-center p-5">
          <h2 className="text-4xl font-extrabold text-purple-800 mb-10">
            ✨ How It Works
          </h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={sectionVariants} // Reuse for stagger effect on items
          >
            {[
              {
                
                title: "Donate Food",
                desc: "Easily list your surplus food to prevent waste and help those in need.",
              },
              {
                
                title: "Discover & Find",
                desc: "Browse through available food listings in your local area.",
              },
              {
                
                title: "Request & Collect",
                desc: "Simply request the food you need and arrange for pickup.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                className="p-8 bg-white rounded-xl shadow-lg border border-purple-200 flex flex-col items-center transform transition-all duration-300"
              >
                <motion.div
                  className="text-5xl mb-4 p-4 rounded-full bg-purple-200 text-purple-700"
                  initial={{ rotate: 0 }}
                  whileInView={{ rotate: 360 }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                >
                  
                  {step.icon === "donating-hand" && "🤲"}
                  {step.icon === "magnifying-glass" && "🔍"}
                  {step.icon === "clipboard-check" && "✅"}
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-md text-gray-700 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/*Extra Section 2*/}
      <motion.div
        className="bg-gradient-to-br from-blue-50 to-green-50 py-20 mt-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-5xl mx-auto text-center p-5">
          <h2 className="text-4xl font-extrabold text-blue-800 mb-10">
            💖 What Our Users Say
          </h2>
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={sectionVariants} // Reuse for stagger effect
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              className="bg-white shadow-xl p-8 rounded-xl border border-blue-200 transform transition-all duration-300"
            >
              <p className="italic text-gray-700 text-lg leading-relaxed mb-4">
                “This platform has truly revolutionized how we manage surplus
                food. It's incredibly efficient and impactful. Highly recommend
                for anyone looking to make a difference!”
              </p>
              <h4 className="mt-3 text-xl font-bold text-blue-700">
                — Ahmed Khan, Dedicated Donor
              </h4>
              <p className="text-sm text-gray-500">Local Business Owner</p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              className="bg-white shadow-xl p-8 rounded-xl border border-green-200 transform transition-all duration-300"
            >
              <p className="italic text-gray-700 text-lg leading-relaxed mb-4">
                “In my time of need, FoodShare was a beacon of hope. Finding nutritious
                meals was simple and dignified. Forever grateful for this
                amazing initiative!”
              </p>
              <h4 className="mt-3 text-xl font-bold text-green-700">
                — Fatima Begum, Grateful Receiver
              </h4>
              <p className="text-sm text-gray-500">Community Member</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/*Little Content Footer - Home Page Only */}
      <motion.footer
        className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 text-center mt-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-lg mb-2">
            © {new Date().getFullYear()} FoodShare. All rights reserved.
          </p>
          <p className="text-sm text-gray-400">
            Empowering communities through shared meals and reduced waste.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;