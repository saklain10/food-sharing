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

  // Use constants for values that are repeated or might change.
  const SLIDE_INTERVAL = 5000; // 5 seconds
  const FEATURED_FOODS_LIMIT = 6;
  const BANNER_TRANSITION_DURATION = 0.8;
  const SECTION_VIEWPORT = { once: true, amount: 0.3 };
  const SECTION_SPACING = "my-7"; // Consistent spacing for all sections

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
    const fetchFeaturedFoods = async () => {
      try {
        const res = await axios.get("https://mission-scic11-server-template-main.vercel.app/available-foods");
        const sorted = res.data
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, FEATURED_FOODS_LIMIT);
        setFeaturedFoods(sorted);
      } catch (error) {
        console.error("Failed to fetch featured foods:", error);
      }
    };
    fetchFeaturedFoods();

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(slideInterval);
  }, [bannerImages.length]);

  const handleViewDetails = (id) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/food/${id}`);
    }
  };

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
      transition: { duration: BANNER_TRANSITION_DURATION, ease: "easeOut" },
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: { duration: BANNER_TRANSITION_DURATION, ease: "easeOut" },
    }),
  };

  const paginate = (newDirection) => {
    setCurrentSlide((prev) => {
      const nextIndex = (prev + newDirection + bannerImages.length) % bannerImages.length;
      return nextIndex;
    });
  };

  return (
    <div className="bg-white"> {/* Ensures the entire background is white */}
      {/* Hero Section (Banner) */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative h-[80vh] overflow-hidden"
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

      {/* Featured Foods Section */}
      <motion.div
        className={`max-w-7xl mx-auto p-5 ${SECTION_SPACING}`}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={SECTION_VIEWPORT}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4 md:mb-0">
            🍱 Featured Foods
          </h2>
          <Link to="/available-foods">
            <motion.button
              className="btn btn-lg bg-blue-600 text-white border-none rounded-full px-8 py-3 shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Foods
            </motion.button>
          </Link>
        </div>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={sectionVariants}
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
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
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
                </div>
                <motion.button
                  onClick={() => handleViewDetails(food._id)}
                  className="btn btn-block bg-blue-600 text-white border-none rounded-lg px-6 py-3 text-lg shadow-md hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 mt-4"
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

      {/* How It Works Section */}
      <motion.div
        className={`bg-white py-3 ${SECTION_SPACING}`}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={SECTION_VIEWPORT}
      >
        <div className="max-w-6xl mx-auto text-center p-5">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
            ✨ How It Works
          </h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={sectionVariants}
          >
            {[
              {
                icon: "🤲",
                title: "Donate Food",
                desc: "Easily list your surplus food to prevent waste and help those in need.",
              },
              {
                icon: "🔍",
                title: "Discover & Find",
                desc: "Browse through available food listings in your local area.",
              },
              {
                icon: "✅",
                title: "Request & Collect",
                desc: "Simply request the food you need and arrange for pickup.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                className="p-8 bg-gray-50 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center transform transition-all duration-300"
              >
                <motion.div
                  className="text-5xl mb-4 p-4 rounded-full text-blue-600"
                  initial={{ rotate: 0 }}
                  whileInView={{ rotate: 360 }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                >
                  {step.icon}
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

      {/* Testimonials Section */}
      <motion.div
        className={`bg-white py-3 ${SECTION_SPACING}`}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={SECTION_VIEWPORT}
      >
        <div className="max-w-5xl mx-auto text-center p-5">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-5">
            💖 What Our Users Say
          </h2>
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={sectionVariants}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              className="bg-gray-50 shadow-xl p-8 rounded-xl border border-gray-200 transform transition-all duration-300"
            >
              <p className="italic text-gray-700 text-lg leading-relaxed mb-4">
                “This platform has truly revolutionized how we manage surplus
                food. It's incredibly efficient and impactful. Highly recommend
                for anyone looking to make a difference!”
              </p>
              <h4 className="mt-3 text-xl font-bold text-blue-600">
                — Ahmed Khan, Dedicated Donor
              </h4>
              <p className="text-sm text-gray-500">Local Business Owner</p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              className="bg-gray-50 shadow-xl p-8 rounded-xl border border-gray-200 transform transition-all duration-300"
            >
              <p className="italic text-gray-700 text-lg leading-relaxed mb-4">
                “In my time of need, FoodShare was a beacon of hope. Finding nutritious
                meals was simple and dignified. Forever grateful for this
                amazing initiative!”
              </p>
              <h4 className="mt-3 text-xl font-bold text-blue-600">
                — Fatima Begum, Grateful Receiver
              </h4>
              <p className="text-sm text-gray-500">Community Member</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Call to Action/Newsletter Section */}
      <motion.div
        className={`bg-white py-3 ${SECTION_SPACING}`}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={SECTION_VIEWPORT}
      >
        <div className="max-w-4xl mx-auto text-center p-5">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-5">
            🌍 Be a Part of the Solution!
          </h2>
          <p className="text-xl leading-relaxed text-gray-700 mb-8">
            Join our growing community dedicated to ending food waste and feeding those in need.
            Sign up for our newsletter to get updates, success stories, and ways to contribute!
          </p>
          <form className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="p-4 rounded-lg flex-grow w-full sm:w-auto max-w-md text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              required
            />
            <motion.button
              type="submit"
              className="btn btn-lg bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg px-8 py-4 shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe Now!
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Lucrative Footer */}
      <motion.footer
        className="bg-blue-700 text-white py-12" 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={SECTION_VIEWPORT}
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Section 1: Brand Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">🍅FoodSharing</h3>
            <p className="text-blue-200 leading-relaxed mb-4">
              Connecting surplus food with those who need it most, building a sustainable and compassionate community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300">
                <i className="fab fa-linkedin-in text-xl"></i>
              </a>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-100">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white hover:text-blue-300 transition-colors duration-300">Home</Link></li>
              <li><Link to="/available-foods" className="text-white hover:text-blue-300 transition-colors duration-300">Available Foods</Link></li>
              <li><Link to="/add-food" className="text-white hover:text-blue-300 transition-colors duration-300">Add Food</Link></li>
              <li><Link to="/about" className="text-white hover:text-blue-300 transition-colors duration-300">About Us</Link></li>
              <li><Link to="/contact" className="text-white hover:text-blue-300 transition-colors duration-300">Contact Us</Link></li>
            </ul>
          </div>

          {/* Section 3: Support */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-100">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-white hover:text-blue-300 transition-colors duration-300">FAQ</Link></li>
              <li><Link to="/privacy-policy" className="text-white hover:text-blue-300 transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-white hover:text-blue-300 transition-colors duration-300">Terms of Service</Link></li>
              <li><Link to="/help" className="text-white hover:text-blue-300 transition-colors duration-300">Help Center</Link></li>
            </ul>
          </div>

          {/* Section 4: Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-100">Contact Us</h3>
            <p className="text-white mb-2">123 FoodSharing Lane, Community City, 12345</p>
            <p className="text-white mb-2">Email: info@foodsharing.org</p>
            <p className="text-white mb-2">Phone: +1 (555) 123-4567</p>
          </div>
        </div>

        
      </motion.footer>
    </div>
  );
};

export default Home;