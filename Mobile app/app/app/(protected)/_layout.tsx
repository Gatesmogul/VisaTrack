import { getMe } from "@/services/user";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then((me) => {
        if (me.status !== "PROFILE_COMPLETE") {
          router.replace("../onboarding-1");
        }
      })
      .catch(() => {
        router.replace("/signUpScreen");
      });
  }, []);

  return children;
}
