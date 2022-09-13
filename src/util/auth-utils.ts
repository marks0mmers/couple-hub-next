import { Redirect } from "next";

export const goToSignIn = (): { redirect: Redirect } => ({
  redirect: {
    destination: "/api/auth/signIn",
    permanent: false,
  },
});
