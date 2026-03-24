"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  Tags,
  CreditCard,
  GraduationCap,
  LayoutGrid,
  BookCheck,
  MessageCircle,
  Bell,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Quote,
  BriefcaseBusiness,
  School,
  UserPlus,
  ShieldUser,
  Megaphone,
  Mail,
  Newspaper,
  Bookmark,
  Feather,
  Award,
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Tags", href: "/admin/tags", icon: Tags },
  { label: "Categories", href: "/admin/categories", icon: LayoutGrid },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Instructors", href: "/admin/instructors", icon: School },
  { label: "Students", href: "/admin/students", icon: GraduationCap },
  { label: "Enrollments", href: "/admin/enrollments", icon: BookCheck },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Reviews", href: "/admin/reviews", icon: MessageCircle },
  { label: "Administrators", href: "/admin/administrators", icon: ShieldUser },
  {
    label: "Community",
    icon: Users,
    children: [
      {
        label: "Management Teams",
        href: "/admin/management-teams",
        icon: BriefcaseBusiness,
      },
      {
        label: "Contact Messages",
        href: "/admin/contact-messages",
        icon: MessageCircle,
      },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { label: "Hiring", href: "/admin/hiring", icon: UserPlus },
    ],
  },
  {
    label: "Notifications",
    icon: Bell,
    children: [
      {
        label: "Broadcasts",
        href: "/admin/broadcasts",
        icon: Megaphone,
      },
      {
        label: "Newsletters",
        href: "/admin/newsletters",
        icon: Mail,
      },
    ],
  },
  {
    label: "Blogs",
    icon: Newspaper,
    children: [
      {
        label: "Categories",
        href: "/admin/blogs/categories",
        icon: Bookmark,
      },
      {
        label: "Posts",
        href: "/admin/blogs/posts",
        icon: Feather,
      },
    ],
  },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [expandedDropdowns, setExpandedDropdowns] = useState<
    Record<string, boolean>
  >({});
  const [collapsed, setCollapsed] = useState(true);
  const toggleDropdown = (label: string) => {
    setExpandedDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
      ...Object.fromEntries(
        Object.keys(prev)
          .filter((key) => key !== label)
          .map((key) => [key, false]),
      ),
    }));
  };
  const handleGroupClick = (label: string) => {
    if (collapsed) {
      setCollapsed(false);
      setExpandedDropdowns((prev) => ({
        ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
        [label]: true,
      }));
      return;
    }
    toggleDropdown(label);
  };

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-[color:var(--color-neutral-200)] bg-white",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex justify-end px-2 py-2 border-b border-[color:var(--color-neutral-200)]">
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[color:var(--color-neutral-50)] text-[color:var(--color-neutral-600)]"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
      <nav className="py-3">
        <ul className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedDropdowns[item.label];
            const isActive =
              item.href &&
              (pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href)));
            const Icon = item.icon;

            return (
              <li key={item.label}>
                {hasChildren ? (
                  <button
                    onClick={() => handleGroupClick(item.label)}
                    className={cn(
                      "flex w-full items-center rounded-lg px-3 py-1.5 text-sm",
                      collapsed ? "justify-center" : "justify-between",
                      "hover:bg-[color:var(--color-neutral-50)]",
                      "text-[color:var(--color-neutral-700)]",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md",
                          collapsed && "bg-[color:var(--color-neutral-100)]",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed &&
                      (isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      ))}
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={() => setExpandedDropdowns({})}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-1.5 text-sm",
                      collapsed ? "justify-center" : "justify-start",
                      "hover:bg-[color:var(--color-neutral-50)]",
                      isActive
                        ? "bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
                        : "text-[color:var(--color-neutral-700)]",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md">
                        <Icon className="h-4 w-4" />
                      </div>
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                  </Link>
                )}

                {hasChildren && isExpanded && !collapsed && (
                  <ul className="ml-6 mt-1 flex flex-col gap-1">
                    {item.children!.map((child) => {
                      const childIsActive =
                        pathname === child.href ||
                        (child.href &&
                          child.href !== "/admin" &&
                          pathname?.startsWith(child.href));
                      const ChildIcon = child.icon;
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href!}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-xs",
                              "hover:bg-[color:var(--color-neutral-50)]",
                              childIsActive
                                ? "bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
                                : "text-[color:var(--color-neutral-600)]",
                            )}
                          >
                            <ChildIcon className="h-3 w-3" />
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
