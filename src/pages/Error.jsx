import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black p-4">
      {/* 404 Heading */}
      <h1 className="text-9xl font-extrabold text-black tracking-widest animate-pulse">
        404
      </h1>
      
      {/* Subheading with descriptive text */}
      <div className="bg-orange-500 px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      
      {/* Main message */}
      <p className="mt-8 text-center text-lg md:text-xl text-gray-600">
        Oops! It looks like you've stumbled upon a page that doesn't exist.
      </p>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="mt-6 px-6 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Error;
