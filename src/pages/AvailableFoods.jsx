import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";

const AvailableFoods = () => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [layoutColumns, setLayoutColumns] = useState(3);

  const { data: foods = [], isLoading } = useQuery({
    queryKey: ["available-foods"],
    queryFn: async () => {
      const res = await axiosSecure.get("/available-foods");
      return res.data;
    },
  });

  const filteredAndSortedFoods = [...foods]
    .filter((item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.expireDate);
      const dateB = new Date(b.expireDate);

      if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleLayout = () => {
    setLayoutColumns((prev) => (prev === 3 ? 2 : 3));
  };

  const gridLayoutClass =
    layoutColumns === 3
      ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
      : "grid md:grid-cols-2 gap-8";

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const controlsVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } },
  };

  return (
    <div className="max-w-7xl mx-auto p-5 py-10 min-h-screen">
      <motion.div
        className="text-center mb-12"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600 mb-4">
          Nourishment Awaits
        </h2>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Explore a wide variety of delicious and fresh foods available for sharing.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col md:flex-row gap-5 mb-12 justify-center items-center"
        variants={controlsVariants}
        initial="hidden"
        animate="visible"
      >
        <input
          type="text"
          placeholder="Search food by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="input input-lg input-bordered w-full md:w-96 pl-12 pr-4 rounded-full shadow-lg"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="select select-lg select-bordered w-full md:w-48 rounded-full shadow-lg"
        >
          <option value="asc">Earliest Expiry</option>
          <option value="desc">Latest Expiry</option>
        </select>
        <motion.button
          onClick={toggleLayout}
          className="btn btn-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full px-8 py-3 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {layoutColumns === 3 ? "Show 2 Columns" : "Show 3 Columns"}
        </motion.button>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-dashed rounded-full border-blue-500 mx-auto"
          ></motion.div>
          <p className="mt-4 text-xl text-gray-600">Loading delicious foods...</p>
        </div>
      ) : filteredAndSortedFoods.length > 0 ? (
        <motion.div
          className={gridLayoutClass}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredAndSortedFoods.map((food) => {
            const expireDate = new Date(food.expireDate);
            const formattedExpireDate = isNaN(expireDate.getTime())
              ? "N/A"
              : expireDate.toLocaleString([], {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

            return (
              <motion.div
                key={food._id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white border rounded-xl shadow-lg overflow-hidden flex flex-col h-full group"
              >
                <div className="relative h-56">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-3 py-1 rounded-full">
                    {food.quantity} units
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {food.name}
                    </h3>
                    <p className="text-gray-600 text-base mb-1 flex items-center">
                      📍 {food.location}
                    </p>
                    <p className="text-gray-600 text-base mb-4 flex items-center">
                      📅 Expire: {formattedExpireDate}
                    </p>
                  </div>
                  <Link to={`/food/${food._id}`}>
                    <motion.button
                      className="btn btn-block bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-3 mt-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-3xl text-gray-500 font-semibold mb-4">
            No delicious foods found matching your criteria.
          </p>
          <p className="text-lg text-gray-600">
            Try adjusting your search or sorting options.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AvailableFoods;
