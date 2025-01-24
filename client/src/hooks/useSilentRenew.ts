import { useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

export const useSilentRenew = () => {
  useEffect(() => {
    const interval = setInterval(
      async () => {
        try {
          await axiosInstance.post("/auth/silentRenew");
        } catch (error) {
          console.error("Failed to renew token", error);
        }
      },
      15 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, []);
};
