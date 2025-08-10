import axios from "axios";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth actions
  const createUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const googleSignIn = () => signInWithPopup(auth, new GoogleAuthProvider());
  const updateUser = (userInfo) => updateProfile(auth.currentUser, userInfo);
  const logOut = () => signOut(auth);

  // Auto-token verification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true);
          // console.log("🔑 Firebase ID Token:", token);

          // Send token to backend
          const response = await axios.get("https://mission-scic11-server-template-main.vercel.app", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // console.log("✅ Backend response:", response.data);
        } catch (error) {
          console.error("❌ Error calling backend:", error.response?.data || error.message);
        }
      } else {
        console.warn("🚫 No user logged in — token not sent");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        createUser,
        signIn,
        googleSignIn,
        updateUser,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
