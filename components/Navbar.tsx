"use client";
import React from "react";
import Link from "next/link";
import Button from "./ui/Button";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Lock,
  LayoutDashboard,
} from "lucide-react";
import Container from "./Container";
import { SITE_NAME } from "@/lib/constant";
import { usePathname } from "next/navigation";
import { useStudentAuth } from "@/lib/hooks/useStudentAuth";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const pathname = usePathname();
  const { logout } = useStudentAuth();

  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);

  // Desktop account dropdown state
  const [accountOpen, setAccountOpen] = React.useState(false);
  const desktopMenuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // Check localStorage for user data on mount
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Only show navbar for students
          if (parsedUser.userType === "STUDENT") {
            setUser(parsedUser);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check on focus/visibility change to catch same-tab changes
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Re-check auth state when pathname changes (for navigation-based auth state updates)
  React.useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Only show navbar for students
          if (parsedUser.userType === "STUDENT") {
            setUser(parsedUser);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
  }, [pathname]);

  React.useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      const target = e.target as Node;
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  const handleLogout = React.useCallback(async () => {
    await logout();
    setIsLoggedIn(false);
    setUser(null);
    setAccountOpen(false);
  }, [logout]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-[color:var(--color-neutral-200)]">
      <Container>
        <div className="h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[color:var(--color-primary-600)]"></div>
              <span
                className="font-semibold text-lg tracking-tight"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                {SITE_NAME}
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                href="/courses"
                className="hover:text-[color:var(--color-primary-700)]"
              >
                Courses
              </Link>
              <Link
                href="/categories"
                className="hover:text-[color:var(--color-primary-700)]"
              >
                Categories
              </Link>
              <Link
                href="/testimonials"
                className="hover:text-[color:var(--color-primary-700)]"
              >
                Testimonials
              </Link>
              <Link
                href="/contact"
                className="hover:text-[color:var(--color-primary-700)]"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div
            className="hidden md:flex items-center gap-3 relative"
            ref={desktopMenuRef}
          >
            <div className="relative hidden lg:block">
              <input
                placeholder="Search courses"
                className="h-10 w-48 lg:w-64 rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 shadow-xs focus:border-[color:var(--color-primary-400)]"
              />
            </div>
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  aria-label="Open account menu"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  aria-controls="desktop-account-menu"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-neutral-700)] shadow-xs hover:border-[color:var(--color-primary-200)] hover:text-[color:var(--color-primary-700)]"
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                </button>
                {accountOpen && (
                  <div
                    id="desktop-account-menu"
                    role="menu"
                    className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-lg border border-[color:var(--color-neutral-200)] bg-white shadow-md"
                  >
                    <div className="py-1 text-sm">
                      <Link
                        href="/dashboard"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                        role="menuitem"
                      >
                        <LayoutDashboard
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                        Dashboard
                      </Link>
                      <Link
                        href="/account/edit-profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4" aria-hidden="true" />
                        Edit profile
                      </Link>
                      <Link
                        href="/account/change-password"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                        role="menuitem"
                      >
                        <Lock className="h-4 w-4" aria-hidden="true" />
                        Change password
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-[color:var(--color-neutral-50)] text-red-600 hover:text-red-700 cursor-pointer"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="h-10">
                  Login
                </Button>
              </Link>
            )}
          </div>
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--color-neutral-200)]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle Menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>
      {open && (
        <div className="md:hidden border-t border-[color:var(--color-neutral-200)]">
          <Container className="py-4" id="mobile-nav">
            <div className="flex flex-col gap-1">
              <Link
                href="/courses"
                className="px-2 py-2 rounded-md hover:bg-[color:var(--color-neutral-50)]"
                onClick={handleClose}
              >
                Courses
              </Link>
              <Link
                href="/categories"
                className="px-2 py-2 rounded-md hover:bg-[color:var(--color-neutral-50)]"
                onClick={handleClose}
              >
                Categories
              </Link>
              <Link
                href="/testimonials"
                className="px-2 py-2 rounded-md hover:bg-[color:var(--color-neutral-50)]"
                onClick={handleClose}
              >
                Testimonials
              </Link>
              <Link
                href="/contact"
                className="px-2 py-2 rounded-md hover:bg-[color:var(--color-neutral-50)]"
                onClick={handleClose}
              >
                Contact
              </Link>
              {isLoggedIn ? (
                <>
                  <div className="border-t border-[color:var(--color-neutral-200)] mt-2 pt-2">
                    <Link
                      href="/dashboard"
                      className="px-2 py-2 rounded-md hover:bg-[color:var(--color-neutral-50)] flex items-center gap-2"
                      onClick={handleClose}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/account/edit-profile"
                      className="px-2 py-2 rounded-md hover:bg-[color:var(--color-neutral-50)] flex items-center gap-2"
                      onClick={handleClose}
                    >
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Link>
                    <Link
                      href="/account/change-password"
                      className="px-2 py-2 rounded-md hover:bg-[color:var(--color-neutral-50)] flex items-center gap-2"
                      onClick={handleClose}
                    >
                      <Lock className="h-4 w-4" />
                      Change Password
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        handleClose();
                      }}
                      className="w-full text-left px-2 py-2 rounded-md hover:bg-[color:var(--color-neutral-50)] text-red-600 hover:text-red-700 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 pt-2">
                  <Link href="/login" className="flex-1" onClick={handleClose}>
                    <Button size="sm" className="w-full h-10">
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
