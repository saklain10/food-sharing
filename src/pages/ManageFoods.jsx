import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

const ManageFoods = () => {
  const { user } = useContext(AuthContext);
  const [myFoods, setMyFoods] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [editFood, setEditFood] = useState(null);
  const [foodToDelete, setFoodToDelete] = useState(null); // for confirmation modal

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

  const headerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Quicker stagger for table rows
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    hover: { scale: 1.01, backgroundColor: 'rgba(240, 240, 240, 0.7)' }, // Subtle hover effect
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


  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      if (user) { // Ensure user is available before fetching token
        const token = await user.getIdToken();
        const res = await axios.get('http://localhost:5000/my-foods', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyFoods(res.data);
      }
    } catch (error) {
      console.error("Error fetching my foods:", error);
      toast.error("Failed to load your food items.");
      setMyFoods([]); // Clear foods on error
    } finally {
      setLoading(false);
    }
  }, [user]); // Depend on user


  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]); // Re-fetch when fetchFoods callback changes (due to user)

  const handleDeleteConfirmed = async () => {
    try {
      const token = await user.getIdToken();
      await axios.delete(`http://localhost:5000/food/${foodToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyFoods(myFoods.filter(food => food._id !== foodToDelete._id));
      toast.success('Food item deleted successfully!');
    } catch (error) {
      console.error("Error deleting food:", error);
      toast.error("Failed to delete food item.");
    } finally {
      setFoodToDelete(null); // Close modal
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      name: form.name.value,
      quantity: parseInt(form.quantity.value), 
      location: form.location.value,

    };

    try {
      const token = await user.getIdToken();
      await axios.patch(`http://localhost:5000/food/${editFood._id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyFoods(myFoods.map(food =>
        food._id === editFood._id ? { ...food, ...updated } : food
      ));

      toast.success('Food item updated successfully!');
    } catch (error) {
      console.error("Error updating food:", error);
      toast.error("Failed to update food item.");
    } finally {
      setEditFood(null); // Close modal
    }
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto p-5 py-10 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-5xl font-extrabold my-7 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 tracking-tight"
        variants={headerVariants}
      >
        Manage Your Donated Foods
      </motion.h2>

      {loading ? (
        <div className="text-center py-20 mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-dashed rounded-full border-blue-500 mx-auto"
          ></motion.div>
          <p className="mt-4 text-xl text-gray-600">Loading your food items...</p>
        </div>
      ) : myFoods.length === 0 ? (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" // Example no-items image
            alt="No items found"
            className="w-48 h-48 mx-auto mb-6 opacity-70"
          />
          <p className="text-3xl text-gray-500 font-semibold mb-3">
            You haven't added any food items yet!
          </p>
          <p className="text-lg text-gray-600">
            Click the "Add Food" link in the navigation to share some surplus food.
          </p>
        </motion.div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <motion.table
            className="table table-auto w-full text-left"
            variants={tableVariants}
            initial="hidden"
            animate="visible"
          >
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="p-4 rounded-tl-xl">Food Name</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Pickup Location</th>
                <th className="p-4 rounded-tr-xl text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence> {/* For exit animations when items are deleted */}
                {myFoods.map((food) => (
                  <motion.tr
                    key={food._id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: 100, transition: { duration: 0.4 } }} // Exit animation for deleted rows
                    whileHover="hover"
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <td className="p-4 text-gray-800 font-medium">{food.name}</td>
                    <td className="p-4 text-gray-700">{food.quantity}</td>
                    <td className="p-4 text-gray-700">{food.location}</td>
                    <td className="p-4 flex flex-col sm:flex-row gap-2 justify-center">
                      <motion.button
                        className="btn btn-warning btn-sm min-w-[70px] bg-yellow-500 text-white hover:bg-yellow-600 border-none transition-all duration-300 transform hover:scale-105"
                        onClick={() => setEditFood(food)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        className="btn btn-error btn-sm min-w-[70px] bg-red-500 text-white hover:bg-red-600 border-none transition-all duration-300 transform hover:scale-105"
                        onClick={() => setFoodToDelete(food)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {editFood && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-200"
              variants={modalContentVariants}
            >
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Food Item</h3>
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="editName" className="block text-gray-700 text-sm font-semibold mb-2">Food Name</label>
                  <input
                    id="editName"
                    name="name"
                    defaultValue={editFood.name}
                    placeholder="Food Name"
                    className="input input-bordered input-lg w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editQuantity" className="block text-gray-700 text-sm font-semibold mb-2">Quantity</label>
                  <input
                    id="editQuantity"
                    type="number"
                    name="quantity"
                    defaultValue={editFood.quantity}
                    placeholder="Quantity"
                    className="input input-bordered input-lg w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editLocation" className="block text-gray-700 text-sm font-semibold mb-2">Pickup Location</label>
                  <input
                    id="editLocation"
                    name="location"
                    defaultValue={editFood.location}
                    placeholder="Pickup Location"
                    className="input input-bordered input-lg w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 shadow-sm"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <motion.button
                    type="button"
                    className="btn btn-neutral btn-lg text-gray-700 hover:text-gray-900 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-6 shadow-sm transition-all duration-300"
                    onClick={() => setEditFood(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="btn btn-primary btn-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none rounded-lg px-6 shadow-md hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Update
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {foodToDelete && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200 text-center"
              variants={modalContentVariants}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/751/751381.png" // Warning icon example
                alt="Warning"
                className="w-20 h-20 mx-auto mb-5"
              />
              <h3 className="text-2xl font-bold mb-3 text-red-600">Confirm Deletion</h3>
              <p className="text-gray-700 text-lg mb-6">
                Are you sure you want to delete <strong className="font-extrabold text-gray-900">{foodToDelete.name}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3 mt-5">
                <motion.button
                  className="btn btn-neutral btn-lg text-gray-700 hover:text-gray-900 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-6 shadow-sm transition-all duration-300"
                  onClick={() => setFoodToDelete(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="btn btn-error btn-lg bg-red-600 text-white border-none rounded-lg px-6 shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={handleDeleteConfirmed}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </motion.div>
  );
};

export default ManageFoods;