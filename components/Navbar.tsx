"use client";

import { useState } from "react";
import { Stethoscope, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuthStore } from "@/lib/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const setRedirect = useAuthStore((s) => s.setRedirect);
  const user = useAuthStore((s) => s.user);

  // Google OAuth Login
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await loginWithGoogle(tokenResponse.access_token);

      // After login, continue to the stored redirect page if exists
      const path = useAuthStore.getState().redirectTo;
      if (path) {
        setRedirect(null);
        router.push(path);
      }
    },
    onError: () => {
      console.error("Google login failed");
    },
  });

  // Book consultation logic
  const handleBook = () => {
    if (!user) {
      setRedirect("/book-appointment");     // store where user wanted to go
      handleGoogleLogin();      // trigger login popup
      return;
    }

    router.push("/book-appointment");
  };

  const userFirstName = user?.name?.split(" ")[0] ?? "";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-foreground">
                Dr. Rachit Ahuja
              </span>
            </div>
          </Link>
          

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-sm hover:text-primary transition">
              Services
            </Link>
            <Link href="/#about" className="text-sm hover:text-primary transition">
              About
            </Link>
            <Link href="/#contact" className="text-sm hover:text-primary transition">
              Contact
            </Link>

            {/* Desktop AUTH */}
            {!user ? (
              <Button variant="outline" onClick={() => handleGoogleLogin()}>
                Sign in
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/appointments">
                  <Button variant="outline">My Appointments</Button>
                </Link>
              </div>
            )}

            {/* BOOK BUTTON with login-first logic */}
            <Button className="bg-primary hover:bg-primary/90" onClick={handleBook}>
              Book Consultation
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="p-2 rounded-md hover:bg-surface"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-max-h duration-300 overflow-hidden bg-white border-t ${
          open ? "max-h-[480px] py-4" : "max-h-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-3">
            <Link href="#services" onClick={() => setOpen(false)} className="py-2">
              Services
            </Link>
            <Link href="#about" onClick={() => setOpen(false)} className="py-2">
              About
            </Link>
            <Link href="#contact" onClick={() => setOpen(false)} className="py-2">
              Contact
            </Link>

            {/* Mobile AUTH */}
            {!user ? (
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  handleGoogleLogin();
                }}
              >
                Sign in
              </Button>
            ) : (
              <>
                <span className="text-sm px-2">Hi, {userFirstName}</span>
                <Link href="/appointments" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    My Appointments
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Book button */}
            <Button
              className="w-full"
              onClick={() => {
                setOpen(false);
                handleBook();
              }}
            >
              Book Consultation
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
