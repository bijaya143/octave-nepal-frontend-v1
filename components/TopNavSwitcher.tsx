"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import InstructorNavbar from "./instructor/InstructorNavbar";
import AdminNavbar from "./admin/AdminNavbar";

export default function TopNavSwitcher() {
  const pathname = usePathname();
  const isInstructor = pathname?.startsWith("/instructor");
  const isAdmin = pathname?.startsWith("/admin");
  return isInstructor ? <InstructorNavbar /> : isAdmin ? <AdminNavbar /> : <Navbar />;
}


