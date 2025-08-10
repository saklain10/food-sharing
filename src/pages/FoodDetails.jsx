import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from "framer-motion";
import { format } from 'date-fns';

const FoodDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Framer Motion Variants
  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const detailsVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.2 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut", delay: 0.4 } },
    hover: { scale: 1.05, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.95 },
  };

  const modalBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalContentVariants = {
    hidden: { y: "-100vh", opacity: 0, scale: 0.8 },
    visible: { y: "0", opacity: 1, scale: 1, transition: { duration: 0.4, type: "spring", stiffness: 100 } },
    exit: { y: "100vh", opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`https://mission-scic11-server-template-main.vercel.app/food/${id}`)
      .then((res) => {
        setFood(res.data);
      })
      .catch((err) => {
        console.error("Error fetching food details:", err);
        toast.error("Failed to load food details.");
        setFood(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleRequest = async () => {
    // Check if the current user is the donor of the food
    if (user && food && user.email === food.donorEmail) {
      toast.warn("You cannot request your own donated food.");
      setShowModal(false);
      return;
    }

    if (!user) {
      toast.error("Please log in to request this food.");
      setShowModal(false);
      return;
    }

    try {
      const token = await user.getIdToken();
      const payload = {
        foodId: food._id,
        donorName: food.donorName,
        donorEmail: food.donorEmail,
        userEmail: user.email,
        requestDate: new Date().toISOString(),
        expireDate: food.expireDate,
        location: food.location,
        notes,
      };

      await axios.post("https://mission-scic11-server-template-main.vercel.app/food-request", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Request sent successfully! 🎉");
      setShowModal(false);
      setNotes("");
    } catch (err) {
      console.error("Error sending request:", err);
      toast.error(err.response?.data?.message || "Failed to send request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-dashed rounded-full border-blue-500 mx-auto"
        ></motion.div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
            alt="Food not found"
            className="w-48 h-48 mx-auto mb-6 opacity-80"
          />
          <p className="text-3xl font-bold text-gray-700 mb-2">Food Item Not Found</p>
          <p className="text-lg text-gray-600">
            The food you are looking for might have been removed or does not exist.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto p-5 py-10 min-h-screen bg-gradient-to-br from-green-50 to-teal-50"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 md:p-8 lg:p-10">
        <motion.img
          src={food.image}
          alt={food.name}
          className="w-full h-80 object-cover rounded-xl shadow-lg mb-8"
          variants={imageVariants}
        />

        <motion.div variants={detailsVariants} className="space-y-4 text-gray-700">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 mb-4 tracking-tight leading-tight">
            {food.name}
          </h2>
          <p className="text-xl font-semibold flex items-center gap-2">
            <span className="text-blue-500 text-3xl">📦</span> Quantity: <span className="text-gray-900">{food.quantity} units</span>
          </p>
          <p className="text-xl font-semibold flex items-center gap-2">
            <span className="text-green-500 text-3xl">📍</span> Pickup Location: <span className="text-gray-900">{food.location}</span>
          </p>
          <p className="text-xl font-semibold flex items-center gap-2">
            <span className="text-red-500 text-3xl">🗓️</span> Expire Date: <span className="text-gray-900">{format(new Date(food.expireDate), "MMM d, yyyy h:mm a")}</span>
          </p>
          <p className="text-xl font-semibold flex items-center gap-2">
            <span className="text-purple-500 text-3xl">🧑‍🍳</span> Donor: <span className="text-gray-900">{food.donorName}</span>
          </p>
          <p className="text-lg text-gray-600 flex items-start gap-2 pt-2">
            <span className="text-yellow-600 text-3xl">📝</span> Additional Notes: <span className="text-gray-800 italic flex-grow">{food.notes || "No additional notes provided."}</span>
          </p>
        </motion.div>

        {user ? (
          <div className="flex justify-center mt-8">
            <motion.button
              className="btn btn-primary btn-lg bg-indigo-600 text-white border-none rounded-full px-10 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transform"
              onClick={() => setShowModal(true)}
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              <span className="text-3xl mr-2">🤝</span> Request This Food
            </motion.button>
          </div>
        ) : (
          <p className="text-center mt-8 text-xl text-gray-600">
            Please <span className="text-blue-500 font-semibold cursor-pointer hover:underline">log in</span> to request this food.
          </p>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
              variants={modalBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl relative border border-gray-200"
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold transition-transform duration-200"
                  onClick={() => setShowModal(false)}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
                <h3 className="text-2xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Confirm Your Request</h3>

                {/* Grid for form fields ..*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Food Name</label>
                    <input readOnly value={food.name} className="input input-bordered input-sm w-full rounded-md bg-gray-50 text-gray-800 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Food ID</label>
                    <input readOnly value={food._id} className="input input-bordered input-sm w-full rounded-md bg-gray-50 text-gray-800 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Donor Email</label>
                    <input readOnly value={food.donorEmail} className="input input-bordered input-sm w-full rounded-md bg-gray-50 text-gray-800 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Your Email</label>
                    <input readOnly value={user?.email} className="input input-bordered input-sm w-full rounded-md bg-gray-50 text-gray-800 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Request Date</label>
                    <input readOnly value={format(new Date(), "MMM d, yyyy h:mm a")} className="input input-bordered input-sm w-full rounded-md bg-gray-50 text-gray-800 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Pickup Location</label>
                    <input readOnly value={food.location} className="input input-bordered input-sm w-full rounded-md bg-gray-50 text-gray-800 cursor-not-allowed" />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Expire Date</label>
                    <input
                      readOnly
                      value={format(new Date(food.expireDate), "MMM d, yyyy h:mm a")}
                      className="input input-bordered input-sm w-full rounded-md bg-gray-50 text-gray-800 cursor-not-allowed"
                    />
                  </div>
                  <div className="col-span-full">
                    <label htmlFor="notesInput" className="block text-gray-700 text-sm font-semibold mb-1">Your Message to Donor (Optional)</label>
                    <textarea
                      id="notesInput"
                      placeholder="e.g., I can pick this up tomorrow morning. Thanks!"
                      className="textarea textarea-bordered w-full rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 h-24 resize-y text-sm"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <motion.button
                    type="button"
                    className="btn btn-neutral text-gray-700 hover:text-gray-900 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 text-base shadow-sm transition-all duration-300"
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="btn btn-success bg-purple-600 text-white border-none rounded-lg px-4 py-2 text-base shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={handleRequest}
                  >
                    Confirm Request
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </motion.div>
  );
};

export default FoodDetails;