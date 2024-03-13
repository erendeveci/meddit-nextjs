import Link from "next/link";
import React from "react";
import { Icons } from "../Icons";
import { buttonVariants } from "../ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "../UserAccountNav";
import SearchBar from "./temp2";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <header className="fixed top-0 inset-x-0 h-fit border-b bg-slate-100 border-zinc-300 z-[10] py-2 ">
      <div className="container max-w-7xl mx-auto h-full flex items-center justify-between gap-2">
        {/* logo   */}
        <Link href="/" className="flex gap-2 items-center">
          <p className="hidden text-zinc-700 text-lg font-semibold md:block">Meddit</p>
        </Link>

        {/*  searchbar */}
        <SearchBar />
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
