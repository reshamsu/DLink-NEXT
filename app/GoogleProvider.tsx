"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

export default function GoogleProvider({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId="314289367130-rbn1rsehinifmife9k76ng0gcbulhfrb.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
