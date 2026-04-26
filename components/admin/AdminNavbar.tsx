"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";
import Container from "../Container";
import { Menu, X, User, Settings, LogOut, Lock } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { getUserType } from "@/lib/utils/auth";
import { SITE_NAME } from "@/lib/constant";

export default function AdminNavbar() {
  const [open, setOpen] = React.useState(false);
  const handleClose = React.useCallback(() => setOpen(false), []);

  const pathname = usePathname();
  const { logout } = useAdminAuth();

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
      const currentUserType = getUserType();

      if (userData && currentUserType) {
        try {
          const parsedUser = JSON.parse(userData);
          // Only show navbar for admins
          if (parsedUser.userType === "ADMIN" && currentUserType === "ADMIN") {
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
      const currentUserType = getUserType();

      if (userData && currentUserType) {
        try {
          const parsedUser = JSON.parse(userData);
          // Only show navbar for admins
          if (parsedUser.userType === "ADMIN" && currentUserType === "ADMIN") {
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
            <Link
              href={isLoggedIn ? "/admin" : "/admin/login"}
              className="flex items-center gap-2"
            >
              <div className="relative h-8 w-8">
                <Image
                  src="/images/logo/octave-nepal-only-logo-transparent.png"
                  alt={`${SITE_NAME} Logo`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span
                className="font-semibold text-lg tracking-tight"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Admin Panel
              </span>
            </Link>
          </div>
          <div
            className="hidden md:flex items-center gap-3 relative"
            ref={desktopMenuRef}
          >
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
                        href="/admin/settings"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4" aria-hidden="true" />
                        Settings
                      </Link>
                      <Link
                        href="/admin/account/change-password"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[color:var(--color-neutral-50)]"
                        role="menuitem"
                      >
                        <Lock className="h-4 w-4" aria-hidden="true" />
                        Change Password
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
              <Link href="/admin/login">
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
            aria-controls="mobile-admin-nav"
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
          <Container className="py-4" id="mobile-admin-nav">
            <div className="flex flex-col gap-1">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/admin/settings"
                    className="px-2 py-2 rounded-md hover:bg-[color:var(--color-neutral-50)]"
                    onClick={handleClose}
                  >
                    Settings
                  </Link>
                  <Link
                    href="/admin/account/change-password"
                    className="px-2 py-2 rounded-md hover:bg-[color:var(--color-neutral-50)]"
                    onClick={handleClose}
                  >
                    Change Password
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      handleClose();
                    }}
                    className="w-full text-left px-2 py-2 rounded-md hover:bg-[color:var(--color-neutral-50)] text-red-600 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 pt-2">
                  <Link
                    href="/admin/login"
                    className="flex-1"
                    onClick={handleClose}
                  >
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
