"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useUserStore from "@/stores/userStore";

const RouteGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const token = useUserStore((state) => state.token);
  const loading = useUserStore((state) => state.loading);
  const initAuth = useUserStore((state) => state.initAuth);
  const [isChecking, setIsChecking] = useState(true);

  const publicRoutes = ["/", "/auth/login", "/auth/signup", "/help", "/about"];

  // Initialize auth on component mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    const handleRouting = async () => {
      if (loading) {
        setIsChecking(true);
        return;
      }

      setIsChecking(true);

      if (!token && !publicRoutes.includes(pathname)) {
        router.replace("/");
        setIsChecking(false);
        return;
      }

      if (token && publicRoutes.includes(pathname)) {
        router.replace("/feed");
        setIsChecking(false);
        return;
      }

      setIsChecking(false);
    };

    handleRouting();
  }, [token, pathname, router, loading]);

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
};

export default RouteGuard;