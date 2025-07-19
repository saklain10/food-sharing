import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const MyRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); 

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
        staggerChildren: 0.08, // Stagger for table rows
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.01, backgroundColor: 'rgba(240, 240, 240, 0.7)' }, // Subtle hover effect
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (user) { // Ensure user is available before fetching token
        const token = await user.getIdToken();
        const res = await axios.get("http://localhost:5000/my-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      }
    } catch (error) {
      console.error("Error fetching my requests:", error);
      toast.error("Failed to load your requests.");
      setRequests([]); // Clear requests on error
    } finally {
      setLoading(false);
    }
  }, [user]); // Depend on user for useCallback

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Re-fetch when fetchData callback changes (due to user)

  return (
    <motion.div
      className="max-w-6xl mx-auto p-5 py-10 min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-5xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 tracking-tight"
        variants={headerVariants}
      >
        My Food Requests
      </motion.h2>

      {loading ? (
        <div className="text-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-dashed rounded-full border-blue-500 mx-auto"
          ></motion.div>
          <p className="mt-4 text-xl text-gray-600">Fetching your requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/746/746197.png" // Example empty requests icon
            alt="No requests found"
            className="w-48 h-48 mx-auto mb-6 opacity-70"
          />
          <p className="text-3xl text-gray-500 font-semibold mb-3">
            You haven't made any food requests yet.
          </p>
          <p className="text-lg text-gray-600">
            Explore available foods and make a request!
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
            <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 text-gray-800 uppercase text-sm font-semibold">
              <tr>
                <th className="p-4 rounded-tl-xl">Donor Name</th>
                <th className="p-4">Pickup Location</th>
                <th className="p-4">Expire Date</th>
                <th className="p-4 rounded-tr-xl">Request Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <motion.tr
                  key={req._id}
                  variants={rowVariants}
                  whileHover="hover"
                  className="border-b border-gray-200 last:border-b-0 group"
                >
                  <td className="p-4 text-gray-800 font-medium flex items-center gap-3">
                    {req.donorImage && (
                        <img
                          src={req.donorImage}
                          alt={req.donorName}
                          className="w-8 h-8 rounded-full object-cover shadow-sm"
                        />
                    )}
                    <span>{req.donorName}</span>
                  </td>
                  <td className="p-4 text-gray-700">{req.location}</td>
                  <td className="p-4 text-gray-700">
                    {req.expire
                      ? new Date(req.expire).toLocaleString([], {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "N/A"}
                  </td>
                  <td className="p-4 text-gray-700">
                    {req.requestDate
                      ? new Date(req.requestDate).toLocaleString([], {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "N/A"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </motion.div>
  );
};

export default MyRequests;