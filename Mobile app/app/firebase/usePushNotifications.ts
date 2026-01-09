import { useEffect } from "react";
import { savePushToken } from "../services/user";
import { auth } from "./firebase.config";
import { registerForPushNotifications } from "./notifications";

export function usePushNotifications() {
  useEffect(() => {
    async function setup() {
      if (!auth.currentUser) return;

      const token = await registerForPushNotifications();
      if (token) {
        await savePushToken(auth.currentUser.uid, token);
      }
    }

    setup();
  }, []);
}
