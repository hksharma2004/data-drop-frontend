"use client";

import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  fullName: string;
  avatar: string;
  email: string;
}

const Sidebar = ({ fullName, avatar, email }: Props) => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">

      <div className="p-4 lg:p-6">
        <Link href="/dashboard" className="block">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="logo"
            width={230}
            height={230}
            className="hidden h-auto lg:block transition-transform hover:scale-105"
          />

          <Image
            src="/assets/icons/logo-brand.svg"
            alt="logo"
            width={84}
            height={84}
            className="lg:hidden transition-transform hover:scale-105"
          />
        </Link>
      </div>


      <nav className="sidebar-nav flex-1 px-2 lg:px-4">
        <ul className="flex flex-1 flex-col gap-2">
          {navItems.map(({ url, name, icon }) => {
            const isActive = pathname === url;
            return (
              <Link key={name} href={url} className="w-full">
                <li
                  className={cn(
                    "group flex w-full items-center border-2 border-white px-3 lg:px-4 py-3 shadow-neo transition-all duration-300 hover:shadow-neo-hover",
                    isActive
                      ? "bg-white text-black shadow-neo-active"
                      : "hover:bg-white hover:text-black"
                  )}
                >
                  <div className="flex items-center gap-3 lg:gap-4 w-full justify-center lg:justify-start">
                    <Image
                      src={icon}
                      alt={name}
                      width={20}
                      height={20}
                      className={cn(
                        "transition-all duration-300 flex-shrink-0 min-w-[20px]",
                        isActive ? "brightness-0" : "group-hover:brightness-0"
                      )}
                    />
                    <span
                      className={cn(
                        "hidden font-semibold transition-colors duration-300 lg:block",
                        isActive
                          ? "text-black"
                          : "text-white group-hover:text-black"
                      )}
                    >
                      {name}
                    </span>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>


      <div className="sidebar-user-info border-2 border-white p-3 lg:p-4 mx-2 lg:mx-4 mb-4">
        <div className="flex items-center gap-3 lg:gap-4 justify-center lg:justify-start w-full">
          <div className="relative sidebar-user-avatar flex-shrink-0">
            <Image
              src={avatar}
              alt="Avatar"
              width={44}
              height={44}
              className="bg-white border-2 border-white shadow-neo w-11 h-11 lg:w-11 lg:h-11 object-cover"
            />
          </div>
          <div className="hidden lg:block min-w-0 flex-1 max-w-[180px]">
            <p className="font-semibold capitalize text-white truncate text-sm">{fullName}</p>
            <p className="text-xs text-white/80 truncate break-all">{email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;