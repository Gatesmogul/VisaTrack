import { apiFetch } from "../lib/api";

export async function getMyProfile() {
  return apiFetch("/users/me");
}

export async function syncUser(payload: {
  fullName: string;
  passportCountry: string;
}) {
  return apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
