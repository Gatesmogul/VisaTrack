import { apiFetch } from "../lib/api";

export const syncUser = async (data: {
  fullName: string;
  passportCountry?: string;
  firebaseUid: string;
    email: string;
}) => {
  return apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const getMe = async () => {
  return apiFetch("/users/me");
};
