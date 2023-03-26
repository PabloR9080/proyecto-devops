import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import pic from "src/public/images/20687.png";
import Greeting from "../components/Greeting";
import React, { useState, useEffect } from "react";
import { Providers } from "../pages/providers";
import { signOut } from "next-auth/react";

const Layout = ({ children }: any) => {
  const [title, setTitle] = useState("Hola mundo anime :3");
  useEffect(() => {
    setTitle("Digital Financiero");
  }, []);
  return (
    <div className="bg-gray-100">
      <Head>
        <title>Digital Finance</title>
      </Head>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  className="w-full h-full p-3 flex text-gray-500 hover:text-gray-700"
                  href="/"
                >
                  <Image
                    className="w-auto h-auto mr-3"
                    src={pic}
                    alt="pig-image"
                  />
                  <div className="h-full flex items-center">
                    Digital Finance
                  </div>
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"
                href="/signin"
              >
                Login
              </Link>
              <button
                onClick={() => signOut()}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Providers>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </Providers>
      </main>
    </div>
  );
};

export default Layout;
