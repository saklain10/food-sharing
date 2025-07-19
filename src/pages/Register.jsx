
import Lottie from "lottie-react";
import { useContext } from "react";
import { BiEnvelope, BiImageAdd, BiKey, BiUser } from "react-icons/bi";
import { useNavigate } from "react-router";
import happy from "../assets/happy.json";
import Social from "../components/Social";
import Title from "../components/Title";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "react-toastify"; 

const Register = () => {
  const goTo = useNavigate();
  const { createUser, setUser, updateUser } =
    useContext(AuthContext); 

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const image = form.image.value;
    const email = form.email.value;
    const pass = form.pass.value;

    console.log(name, email, pass);

    createUser(email, pass)
      .then((res) => {
        updateUser({ displayName: name, photoURL: image }) // Pass photoURL as well
          .then(() => {
            setUser({ ...res.user, displayName: name, photoURL: image });
            toast.success("Registration successful! Welcome! 🎉"); // Success toast
            goTo("/"); // Redirect to home page
          })
          .catch((error) => {
            console.error("Error updating user profile:", error);
            toast.error("Registration successful, but profile update failed. Please try logging in again.");
            goTo("/"); // Still redirect to home even if profile update fails
          });
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        // Display specific error messages from Firebase if available
        let errorMessage = "Registration failed. Please try again.";
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered. Please use a different email.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Please use a stronger password.';
        }
        toast.error(errorMessage); // Error toast
      });
  };

  return (
    <div className=" bg-[url(/bg.png)] bg-contain">
      <div className=" bg-white bg-opacity-90 min-h-screen">
        <div className="w-11/12 mx-auto py-10 m-5 p-5  ">
          <div className="title mt-5">
            <Title>Join with Us</Title>
          </div>

          <div className="flex  justify-between items-center gap-5 pt-8">
            <div className="login-for flex-1">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-5 flex flex-col gap-8 backdrop-blur-sm bg-opacity-10 shadow-lg rounded-lg"
              >
                <div className="flex justify-start items-center">
                  <div className="">
                    <BiUser className="text-3xl text-slate-500"></BiUser>
                  </div>
                  <input
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-orange-400 transition-all  duration-200"
                    type="text"
                    name="name"
                    placeholder="Enter Full Name"
                    required // Added required
                  />
                </div>

                <div className="flex justify-start items-center">
                  <div className="">
                    <BiImageAdd className="text-3xl text-slate-500"></BiImageAdd>
                  </div>
                  <input
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-orange-400 transition-all  duration-200"
                    type="text"
                    name="image"
                    placeholder="Enter Image Url"
                  />
                </div>
                <div className="flex justify-start items-center">
                  <div className="">
                    <BiEnvelope className="text-3xl text-slate-500"></BiEnvelope>
                  </div>
                  <input
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-orange-400 transition-all  duration-200"
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    required // Added required
                  />
                </div>

                <div className="flex justify-start items-center">
                  <div className="">
                    <BiKey className="text-3xl text-slate-500"></BiKey>
                  </div>
                  <input
                    className="outline-none flex-1 border-b-2 p-2 bg-transparent focus:border-orange-400 transition-all  duration-200"
                    type="password"
                    name="pass"
                    placeholder="Enter Password"
                    required // Added required
                  />
                </div>

                <input
                  type="submit"
                  value="Register Now"
                  className="btn cursor-pointer"
                />
              </form>
            </div>
            <Social></Social>
            <div className="lottie flex-1 flex mx-20 ">
              <Lottie animationData={happy}></Lottie>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;