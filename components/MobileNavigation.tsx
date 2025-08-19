"use client";

import React from "react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

interface Props {
  $id: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

const MobileNavigation = ({
  $id : ownerId,
  accountId,
  fullName,
  avatar,
  email,
}: Props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  


  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-black border-b-4 border-white shadow-neo">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button 
            className="relative group h-14 w-14 bg-white border-4 border-white shadow-neo hover:shadow-neo-hover active:shadow-neo-active transition-all duration-200 rounded-none flex items-center justify-center touch-manipulation"
            aria-label="Open navigation menu"
          >
            <Image
              src="/assets/icons/menu.svg"
              alt="menu"
              width={24}
              height={24}
              className="object-contain group-hover:opacity-0 transition-opacity duration-200"
            />
            <Image
              src="/assets/icons/menu-orange.svg"
              alt="menu hover"
              width={24}
              height={24}
              className="object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-0 m-auto"
            />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px] p-0 border-r-4 border-black shadow-neo bg-white overflow-hidden">
          <div className="flex flex-col h-full overflow-y-auto">

            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={() => setOpen(false)}
                className="h-10 w-10 bg-white border-4 border-black shadow-neo hover:shadow-neo-hover active:shadow-neo-active transition-all duration-200 rounded-none flex items-center justify-center"
                aria-label="Close navigation"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>


            <div className="p-6 border-b-4 border-black bg-white">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 border-4 border-black shadow-neo bg-white">
                  <Image
                    src={avatar}
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-black truncate capitalize leading-tight">{fullName}</h3>
                  <p className="text-sm text-gray-600 truncate mt-1">{email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6">
              <h4 className="font-bold text-lg text-black mb-6 uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-4">
                {navItems.map(({ url, name, icon }) => (
                  <li key={name}>
                    <Link 
                      href={url} 
                      onClick={handleNavClick}
                      className={cn(
                        "flex items-center gap-4 w-full px-6 py-5 rounded-none border-4 border-black transition-all duration-200 font-bold text-base touch-manipulation",
                        pathname === url 
                          ? "bg-[#FF7A3D] text-white shadow-neo-active transform translate-x-1 translate-y-1" 
                          : "bg-white text-black shadow-neo hover:bg-[#FF7A3D]/10 hover:shadow-neo-hover hover:transform hover:-translate-x-1 hover:-translate-y-1 active:shadow-neo-active active:transform active:translate-x-1 active:translate-y-1"
                      )}
                    >
                      <div className={cn(
                        "w-7 h-7 flex items-center justify-center flex-shrink-0",
                        pathname === url ? "brightness-0 invert" : ""
                      )}>
                        <Image
                          src={icon}
                          alt={name}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <span className="flex-1">{name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>


            <div className="p-6 border-t-4 border-black bg-white space-y-6">
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-black uppercase tracking-wider">Actions</h4>
                <FileUploader ownerId={ownerId} accountId={accountId} />
              </div>
              
              <Button 
                type="button" 
                className="w-full h-16 bg-white text-[#FF7A3D] border-4 border-[#FF7A3D] shadow-neo hover:bg-[#FF7A3D]/10 hover:shadow-neo-hover hover:transform hover:-translate-x-1 hover:-translate-y-1 active:shadow-neo-active active:transform active:translate-x-1 active:translate-y-1 transition-all duration-200 rounded-none font-bold text-base uppercase tracking-wider touch-manipulation" 
                onClick={async () => {
                  await signOutUser();
                  handleNavClick();
                }}
              >
                <Image src="/assets/icons/logout.svg" alt="logout" width={24} height={24} />
                <span className="ml-3">Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>


      <div className="flex-1 flex justify-center">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={60}
          className="h-auto"
        />
      </div>


      <div className="flex items-center">
        <FileUploader 
          ownerId={ownerId} 
          accountId={accountId} 
          className="!h-14 !w-14 !border-white !bg-[#FF7A3D]"
        />
      </div>
    </header>
  );
};

export default MobileNavigation;
