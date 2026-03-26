"use client";
import { UserProvider } from "@/lib/userContext";

export default function Auth0Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
