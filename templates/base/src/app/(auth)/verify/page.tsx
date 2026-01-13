import { Metadata } from "next";

import EmailVerification from "@/components/auth/Verify";

export const metadata: Metadata = {
  title: "Email Verification | Admin Dashboard",
  description: "Verify your email address to complete registration",
};

export default function EmailVerificationPage() {
  return <EmailVerification />;
}
