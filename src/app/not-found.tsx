import React from "react";
import Link from "next/link";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const NotFound = () => {
  return (
    <section className="min-h-screen flex justify-center items-center bg-white bg-no-repeat bg-cover bg-right">
      <div className="max-w-[1500px] text-center px-5 py-10 backdrop-blur-sm bg-transparent rounded-xl mx-4">
        <img 
          src="/not-found.png" 
          alt="Page not found" 
          className="max-w-full md:max-w-[400px] mx-auto mb-8"
        />
        <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-2 tracking-wide">
          LOOKS LIKE YOU'RE LOST
        </h1>
        <p className="text-lg text-gray-600 mb-6 tracking-wide font-light">
          We can't seem to find the page you're looking for
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center border border-black px-7 py-2 rounded-full text-gray-900 font-light text-sm transition-all hover:bg-black hover:text-white"
        >
          Back to Home
          <span className="ml-3 p-1 bg-black text-white rounded-full transition-all group-hover:bg-white group-hover:text-black">
            <HiOutlineArrowNarrowRight />
          </span>
        </Link>
      </div>
    </section>
  );
};

export default NotFound;