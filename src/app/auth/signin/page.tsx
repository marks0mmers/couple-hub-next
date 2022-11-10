"use client";

import { getProviders, signIn } from "next-auth/react";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function Signin() {
  const [providers, setProviders] = useState<Awaited<ReturnType<typeof getProviders>> | null>(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  if (!providers) {
    return <>Invalid Auth Configuration</>;
  }

  return (
    <main className="h-screen grid grid-cols-3 grid-rows-3 bg-primary w-full">
      <section
        className={clsx(
          "col-start-2",
          "row-start-2",
          "bg-white",
          "flex",
          "flex-col",
          "p-4",
          "items-center",
          "rounded-box",
          "shadow-2xl"
        )}
      >
        <article className="prose">
          <h1>Sign In</h1>
        </article>
        <div id="sign-in-options" className="flex-1 flex flex-col justify-center gap-2">
          {Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              className="btn"
              onClick={() =>
                signIn(provider.id, {
                  callbackUrl: "/",
                })
              }
            >
              Sign in with {provider.name}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
