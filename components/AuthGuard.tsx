"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ALLOWED_EMAILS = (process.env.NEXT_PUBLIC_ALLOWED_EMAILS ?? "").split(",");

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("dl_user_email");
    if (!email || !ALLOWED_EMAILS.includes(email)) {
      router.replace("/login");
    } else {
      setVerified(true);
    }
  }, [router]);

  if (!verified) {
    return (
      <div className="lg:ml-72 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
