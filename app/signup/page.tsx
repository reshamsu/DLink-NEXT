"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { TbArrowLeft } from "react-icons/tb";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  return (
    <div className="text-gray-800 relative">
      <div className="absolute z-30 top-8 left-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-800 font-medium hover:text-black p-2 md:p-3 shadow-2xl bg-black/5 hover:bg-white rounded-full"
        >
          <TbArrowLeft size={24} />
        </Link>
      </div>

      <div className="max-w-md mx-auto h-screen flex items-center">
        <div className="bg-white relative w-full h-full md:h-fit md:rounded-3xl overflow-hidden flex flex-col justify-center">
          <form
            className="flex flex-col items-center text-center gap-5 justify-center w-full 2xl:text-base overflow-hidden group p-8 h-screen"
            id="loginForm"
            method="post"
          >
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/favicon.ico"
                alt="TQ"
                width={64}
                height={64}
                className="relative object-contain"
              />
            </Link>

            <div className="flex flex-col gap-1 mb-4">
              <h2 className="text-xl font-bold">Welcome to D-Link Colombo</h2>
              <p className="text-sm text-gray-400 max-w-3xl">
                Start using D-Link Colombo to Explore Listings
              </p>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                theme="outline"
                size="large"
                shape="pill"
                width="330"
                onSuccess={(credentialResponse) => {
                  if (!credentialResponse.credential) {
                    console.log("No credential received");
                    return;
                  }

                  const decoded = jwtDecode(credentialResponse.credential);
                  console.log("Decoded JWT:", decoded);

                  router.push("/dashboard");
                }}
                onError={() => console.log("Login Failed")}
              />
            </div>

            <span className="text-sm text-gray-400">or</span>

            <div className="flex flex-col gap-5 w-full md:px-6">
              <input
                type="email"
                placeholder="Enter email address"
                className="text-[14px] bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5"
                required
              />
              <button type="submit" className="select-none btn-dark-sm">
                Sign Up
              </button>

              <p className="text-xs text-gray-400 py-2">
                By continuing, you agree to D-Link Colombo's{" "}
                <Link href="/login" className="underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/login" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <label className="flex items-center justify-center gap-1 text-sm font-semibold">
              Don't have an account?
              <Link
                href="/login"
                className="text-orange-600 font-bold hover:border-b-2"
              >
                Sign in
              </Link>{" "}
            </label>
          </form>
        </div>
      </div>
    </div>
  );
}