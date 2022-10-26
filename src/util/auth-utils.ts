import { authOptions } from "../pages/api/auth/[...nextauth]";
import { cookies } from "next/headers";

export function customGetSession() {
  return authOptions.adapter?.getSessionAndUser(cookies().get("next-auth.session-token") ?? "");
}
