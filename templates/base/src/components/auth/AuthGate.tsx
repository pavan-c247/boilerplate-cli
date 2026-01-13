"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import LoadingSpinner from "@/components/pure-components/LoadingSpinner";




export default function AuthGate({
  children,
}: {children: ReactNode}) {
  
  return <>{children}</>;
}