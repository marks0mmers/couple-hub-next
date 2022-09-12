import { Bars3BottomLeftIcon } from "@heroicons/react/20/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="navbar bg-primary justify-between">
      <div id="left">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
          <Bars3BottomLeftIcon className="h-6 w-6 text-primary-content" />
        </label>
        <article className="prose">
          <h1 className="text-primary-content">Couple Planner</h1>
        </article>
      </div>
      <div id="right" className="flex gap-4 pr-4">
        <select data-choose-theme={true} className="select select-sm select-bordered">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        { session?.user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-primary normal-case">
              <div id="user" className="flex gap-2">
                <div className="avatar">
                  <div className="w-8 rounded-lg">
                    <Image src={session?.user?.image ?? ""} alt="profile_picture" width={32} height={32}/>
                  </div>
                </div>
                <article className="prose flex items-center">
                  <p className="text-primary-content">{session?.user?.name}</p>
                </article>
              </div>
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li onClick={() => signOut()}><a>Sign Out</a></li>
            </ul>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => signIn()}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
