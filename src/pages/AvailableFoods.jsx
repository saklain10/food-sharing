import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure";
import { FaSearch, FaSortAmountDown, FaTh, FaList } from 'react-icons/fa';
import { IoIosRefresh } from 'react-icons/io';
import { format } from 'date-fns';

const AvailableFoods = () => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [layoutColumns, setLayoutColumns] = useState(3);

  const { data: foods = [], isLoading, refetch } = useQuery({
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

      // Handle invalid dates gracefully at the end of the sort order
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
      ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      : "grid md:grid-cols-2 gap-6";

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
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <motion.div
        className="text-center mb-12"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-5xl font-extrabold text-blue-600 mb-4">
          Nourishment Awaits
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore a wide variety of delicious and fresh foods available for sharing.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col md:flex-row gap-4 mb-12 justify-center items-center"
        variants={controlsVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search food by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="input input-lg input-bordered w-full pl-12 pr-4 rounded-full shadow-lg border-blue-600 focus:border-blue-600 focus:ring-blue-600"
          />
        </div>
        <div className="relative w-full md:w-48">
          <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="select select-lg select-bordered w-full pl-12 pr-4 rounded-full shadow-lg border-blue-600 focus:border-blue-600 focus:ring-blue-600"
          >
            <option value="asc">Earliest Expiry</option>
            <option value="desc">Latest Expiry</option>
          </select>
        </div>
        <motion.button
          onClick={toggleLayout}
          className="btn btn-lg bg-blue-600 hover:bg-blue-800 text-white rounded-full px-8 py-3 shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {layoutColumns === 3 ? <FaList /> : <FaTh />}
          <span>{layoutColumns === 3 ? "List View" : "Grid View"}</span>
        </motion.button>
        <motion.button
          onClick={() => refetch()}
          className="btn btn-lg bg-blue-600 hover:bg-blue-800 text-white rounded-full px-8 py-3 shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoIosRefresh className="text-2xl" />
        </motion.button>
      </motion.div>

      {/* Content. .*/}
      {isLoading ? (
        <div className="text-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-dashed rounded-full border-blue-600 mx-auto"
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
              : format(expireDate, "MMM d, yyyy h:mm a");

            return (
              <motion.div
                key={food._id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full group transition-all duration-300 transform"
              >
                <div className="relative h-48">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white text-blue-600 font-semibold text-sm px-3 py-1 rounded-full shadow-md">
                    {food.quantity} units
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {food.name}
                    </h3>
                    {/* <p className="text-gray-600 text-sm mb-1">
                      <span className="font-semibold">Donated by:</span>{" "}
                      {food.donator ? food.donator.name : "Unknown"}
                    </p> */}
                    <p className="text-gray-600 text-sm mb-1 flex items-center">
                      <span className="font-semibold">Location:</span> 📍 {food.location}
                    </p>
                    <p className="text-gray-600 text-sm mb-1 flex items-center">
                      <span className="font-semibold">Expires:</span> 📅 {formattedExpireDate}
                    </p>
                  </div>
                  <Link to={`/food/${food._id}`}>
                    <motion.button
                      className="btn btn-block bg-blue-600 hover:bg-blue-800 text-white rounded-lg py-2 mt-4 text-base"
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