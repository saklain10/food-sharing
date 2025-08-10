import React, { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../api/axiosSecure"; // ✅ use secure axios

const AddFood = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    quantity: "",
    location: "",
    expireDate: "",
    notes: "",
  });

  const queryClient = useQueryClient();

  const addFoodMutation = useMutation({
    mutationFn: (food) => axiosSecure.post("/add-food", food),
    onSuccess: () => {
      toast.success("🍽️ Food added successfully!");
      queryClient.invalidateQueries(["available-foods"]);
      // Reset form
      setFormData({
        name: "",
        image: "",
        quantity: "",
        location: "",
        expireDate: "",
        notes: "",
      });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "❌ Failed to add food. Please try again."
      );
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.expireDate) {
      toast.error("🗓️ Please select an approximate expiry date/time.");
      return;
    }

    const dateObject = new Date(formData.expireDate);
    if (isNaN(dateObject.getTime())) {
      toast.error("🗓️ Invalid expiry date/time. Please enter a valid date.");
      return;
    }

    const food = {
      ...formData,
      quantity: parseInt(formData.quantity),
      expireDate: dateObject.toISOString(),
      status: "available",
      donorName: user?.displayName || "Unknown Donor",
      donorEmail: user?.email,
      donorImage: user?.photoURL || null,
      requestCount: 0,
    };

    addFoodMutation.mutate(food);
  };

  // Framer Motion variants (unchanged)
  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const headerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="max-w-xl mx-auto w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h2
          className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-600 tracking-wide"
          variants={headerVariants}
        >
          Share Your Surplus Food
        </motion.h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Food Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Cooked Rice"
              className="input input-bordered input-lg w-full rounded-lg"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Image URL</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/food.jpg"
              className="input input-bordered input-lg w-full rounded-lg"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g., 5 portions"
              className="input input-bordered input-lg w-full rounded-lg"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Pickup Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Dhaka"
              className="input input-bordered input-lg w-full rounded-lg"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Approximate Expiry Date/Time</label>
            <input
              type="datetime-local"
              name="expireDate"
              value={formData.expireDate}
              onChange={handleChange}
              className="input input-bordered input-lg w-full rounded-lg"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g., contains nuts, spicy"
              className="textarea textarea-bordered textarea-lg w-full rounded-lg resize-y h-32"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={addFoodMutation.isLoading}
            className="btn btn-lg bg-gradient-to-r from-blue-700 to-blue-600 text-white w-full md:col-span-2 rounded-lg py-3 text-xl font-semibold shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            {addFoodMutation.isLoading ? "Adding..." : "Add Food Now"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddFood;
