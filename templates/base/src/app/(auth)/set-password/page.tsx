import { Metadata } from "next";

import SetPasswordForm from "@/components/auth/set-password/set-password";

export const metadata: Metadata = {
  title: "Set Password",
  description: "Set Password to access your dashboard",
};

export default function SetPasswordPage() {
  return <SetPasswordForm />;
}
