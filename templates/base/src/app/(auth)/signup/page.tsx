import { Metadata } from "next";

import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Signup | Admin Dashboard",
  description: "Signup to access your admin dashboard",
};

export default function LoginPage() {
  return <SignupForm />;
}
