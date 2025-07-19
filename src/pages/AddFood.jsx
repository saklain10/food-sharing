// // 1. AddFood.jsx
// import React, { useContext, useState } from 'react';
// import { AuthContext } from '../providers/AuthProvider';
// import axios from 'axios';

// const AddFood = () => {
//   const { user } = useContext(AuthContext);
//   const [formData, setFormData] = useState({});

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const food = {
//       ...formData,
//       status: 'available',
//       donorName: user.displayName,
//       donorEmail: user.email,
//       donorImage: user.photoURL,
//     };

//     try {
//       const token = await user.getIdToken();
//       const res = await axios.post('http://localhost:5000/add-food', food, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('Food added successfully');
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-5">
//       <h2 className="text-3xl font-bold mb-4">Add New Food</h2>
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
//         <input name="name" placeholder="Food Name" onChange={handleChange} className="input input-bordered" required />
//         <input name="image" placeholder="Food Image URL" onChange={handleChange} className="input input-bordered" required />
//         <input name="quantity" placeholder="Quantity" onChange={handleChange} className="input input-bordered" required />
//         <input name="location" placeholder="Pickup Location" onChange={handleChange} className="input input-bordered" required />
//         <input name="expire" type="datetime-local" onChange={handleChange} className="input input-bordered" required />
//         <textarea name="notes" placeholder="Additional Notes" onChange={handleChange} className="textarea textarea-bordered" />
//         <button className="btn btn-primary">Add Food</button>
//       </form>
//     </div>
//   );
// };

// export default AddFood;

// import React, { useContext, useState } from "react";
// import { AuthContext } from "../providers/AuthProvider";
// import axios from "axios";
// import { toast } from "react-toastify";

// const AddFood = () => {
//   const { user } = useContext(AuthContext);
//   const [formData, setFormData] = useState({
//     name: "",
//     image: "",
//     quantity: "",
//     location: "",
//     expireDate: "",
//     notes: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const food = {
//       ...formData,
//       status: "available",
//       donorName: user?.displayName || "Unknown Donor",
//       donorEmail: user?.email,
//       donorImage: user?.photoURL || null,
//     };

//     try {
//       const token = await user.getIdToken();
//       await axios.post("http://localhost:5000/add-food", food, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("🍽️ Food added successfully!");
//       setFormData({
//         name: "",
//         image: "",
//         quantity: "",
//         location: "",
//         expireDate: "",
//         notes: "",
//       });
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Failed to add food. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-3xl font-bold mb-6 text-center">Add New Food</h2>
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
//         <input
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Food Name"
//           className="input input-bordered w-full"
//           required
//         />
//         <input
//           name="image"
//           value={formData.image}
//           onChange={handleChange}
//           placeholder="Image URL"
//           className="input input-bordered w-full"
//           required
//         />
//         <input
//           name="quantity"
//           value={formData.quantity}
//           onChange={handleChange}
//           placeholder="Quantity"
//           className="input input-bordered w-full"
//           required
//         />
//         <input
//           name="location"
//           value={formData.location}
//           onChange={handleChange}
//           placeholder="Pickup Location"
//           className="input input-bordered w-full"
//           required
//         />
//         <input
//           type="datetime-local"
//           name="expireDate"
//           value={formData.expireDate}
//           onChange={handleChange}
//           className="input input-bordered w-full"
//           required
//         />
//         <textarea
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//           placeholder="Additional Notes (optional)"
//           className="textarea textarea-bordered w-full"
//         ></textarea>
//         <button type="submit" className="btn btn-primary w-full">
//           ➕ Add Food
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddFood;

// // src/pages/AddFood.jsx
// import React, { useContext, useState } from "react";
// import { AuthContext } from "../providers/AuthProvider";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion"; // Import motion

// const AddFood = () => {
//   const { user } = useContext(AuthContext);
//   const [formData, setFormData] = useState({
//     name: "",
//     image: "",
//     quantity: "",
//     location: "",
//     expireDate: "", // Keep as string for input[type="datetime-local"]
//     notes: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate expireDate before processing
//     if (!formData.expireDate) {
//       toast.error("🗓️ Please select an approximate expiry date/time.");
//       return;
//     }

//     const dateObject = new Date(formData.expireDate);
//     if (isNaN(dateObject.getTime())) {
//       // Check if dateObject is "Invalid Date"
//       toast.error("🗓️ Invalid expiry date/time. Please enter a valid date.");
//       return;
//     }

//     const food = {
//       ...formData,
//       quantity: parseInt(formData.quantity), // Ensure quantity is an integer
//       expireDate: dateObject.toISOString(), // Convert to ISO string only if valid
//       status: "available",
//       donorName: user?.displayName || "Unknown Donor",
//       donorEmail: user?.email,
//       donorImage: user?.photoURL || null,
//       requestCount: 0, // Initialize request count
//     };

//     try {
//       const token = await user.getIdToken(); // Get ID token for authentication
//       await axios.post("http://localhost:5000/add-food", food, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("🍽️ Food added successfully!");
//       // Reset form fields after successful submission
//       setFormData({
//         name: "",
//         image: "",
//         quantity: "",
//         location: "",
//         expireDate: "",
//         notes: "",
//       });
//     } catch (err) {
//       console.error("Error adding food:", err);
//       // More user-friendly error message
//       toast.error(
//         err.response?.data?.message || "❌ Failed to add food. Please try again."
//       );
//     }
//   };

//   // Framer Motion variants
//   const pageVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.7,
//         ease: "easeOut",
//         when: "beforeChildren", // Animate parent first, then children
//         staggerChildren: 0.1, // Stagger children animations
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
//   };

//   const headerVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
//   };

//   return (
//     <motion.div
//       className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
//       variants={pageVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       <motion.div
//         className="max-w-xl mx-auto w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100"
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <motion.h2
//           className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 tracking-wide"
//           variants={headerVariants}
//         >
//           Share Your Surplus Food
//         </motion.h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <motion.div variants={itemVariants}>
//             <label htmlFor="foodName" className="block text-gray-700 text-sm font-semibold mb-2">Food Name</label>
//             <input
//               id="foodName"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="e.g., Cooked Rice, Fresh Fruits"
//               className="input input-bordered input-lg w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm"
//               required
//             />
//           </motion.div>

//           <motion.div variants={itemVariants}>
//             <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-semibold mb-2">Image URL</label>
//             <input
//               id="imageUrl"
//               name="image"
//               value={formData.image}
//               onChange={handleChange}
//               placeholder="e.g., https://example.com/food.jpg"
//               className="input input-bordered input-lg w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm"
//               required
//             />
//           </motion.div>

//           <motion.div variants={itemVariants}>
//             <label htmlFor="quantity" className="block text-gray-700 text-sm font-semibold mb-2">Quantity (e.g., portions, kg)</label>
//             <input
//               id="quantity"
//               type="number" // Changed to type number for quantity
//               name="quantity"
//               value={formData.quantity}
//               onChange={handleChange}
//               placeholder="e.g., 5 portions, 2 kg"
//               className="input input-bordered input-lg w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm"
//               required
//             />
//           </motion.div>

//           <motion.div variants={itemVariants}>
//             <label htmlFor="pickupLocation" className="block text-gray-700 text-sm font-semibold mb-2">Pickup Location</label>
//             <input
//               id="pickupLocation"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               placeholder="e.g., Dhaka, Gulshan-1"
//               className="input input-bordered input-lg w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm"
//               required
//             />
//           </motion.div>

//           <motion.div variants={itemVariants} className="md:col-span-2"> {/* Full width on medium screens */}
//             <label htmlFor="expireDate" className="block text-gray-700 text-sm font-semibold mb-2">Approximate Expiry Date/Time</label>
//             <input
//               id="expireDate"
//               type="datetime-local"
//               name="expireDate"
//               value={formData.expireDate}
//               onChange={handleChange}
//               className="input input-bordered input-lg w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm"
//               required
//             />
//           </motion.div>

//           <motion.div variants={itemVariants} className="md:col-span-2"> {/* Full width on medium screens */}
//             <label htmlFor="notes" className="block text-gray-700 text-sm font-semibold mb-2">Additional Notes (e.g., allergy info, cooking style)</label>
//             <textarea
//               id="notes"
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               placeholder="Any specific instructions or details about the food..."
//               className="textarea textarea-bordered textarea-lg w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm resize-y h-32"
//             ></textarea>
//           </motion.div>

//           <motion.button
//             type="submit"
//             className="btn btn-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white border-none w-full rounded-lg py-3 text-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 md:col-span-2"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             variants={itemVariants} // Animate the button as well
//           >
//             Add Food Now
//           </motion.button>
//         </form>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default AddFood;


// src/pages/AddFood.jsx
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
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
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
          className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 tracking-wide"
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
            className="btn btn-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white w-full md:col-span-2 rounded-lg py-3 text-xl font-semibold shadow-lg"
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
