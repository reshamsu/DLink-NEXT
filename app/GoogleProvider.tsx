"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

export default function GoogleProvider({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId="454373247918-uk8j5em60iu73367qho1vdfpaddma36c.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
