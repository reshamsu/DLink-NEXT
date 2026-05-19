"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { TbArrowLeft, TbAlertCircle } from "react-icons/tb";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const ALLOWED_EMAILS = ["resham.iox@gmail.com", "dlink-colombo@gmail.com"];

interface GoogleJwt {
  email: string;
  name: string;
  picture: string;
  given_name: string;
}

export default function Login() {
  const router  = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = (credentialResponse: { credential?: string }) => {
    setError(null);

    if (!credentialResponse.credential) {
      setError("No credential received. Please try again.");
      return;
    }

    const decoded = jwtDecode<GoogleJwt>(credentialResponse.credential);

    if (!ALLOWED_EMAILS.includes(decoded.email)) {
      setError("Access denied. This account is not authorised to sign in.");
      return;
    }

    localStorage.setItem("dl_user_email",   decoded.email);
    localStorage.setItem("dl_user_name",    decoded.name);
    localStorage.setItem("dl_user_picture", decoded.picture);

    router.push("/dashboard");
  };

  return (
    <div className="text-gray-800 relative min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* Back */}
      <div className="absolute top-8 left-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-black p-2.5 bg-white shadow rounded-full transition"
        >
          <TbArrowLeft size={22} />
        </Link>
      </div>

      <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl p-10 flex flex-col items-center gap-7">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center gap-3">
          <Image
            src="/favicon.ico"
            alt="D-Link"
            width={56}
            height={56}
            className="object-contain"
          />
          <div className="text-center">
            <h1 className="text-base font-extrabold uppercase tracking-wide">D-Link Estate</h1>
            <p className="text-[11px] text-gray-400">D-Link Colombo (Pvt) Ltd.</p>
          </div>
        </Link>

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-xl font-bold">Admin Sign In</h2>
          <p className="text-xs text-gray-400 mt-1">
            Authorised accounts only
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="w-full flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">
            <TbAlertCircle size={17} className="shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-snug">{error}</p>
          </div>
        )}

        {/* Google login */}
        <GoogleLogin
          theme="outline"
          size="large"
          shape="pill"
          width="280"
          onSuccess={handleSuccess}
          onError={() => setError("Google sign-in failed. Please try again.")}
        />

        <p className="text-[11px] text-gray-400 text-center leading-relaxed">
          By signing in you agree to D-Link Colombo's{" "}
          <Link href="/" className="underline">Terms</Link>{" "}
          and{" "}
          <Link href="/" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
