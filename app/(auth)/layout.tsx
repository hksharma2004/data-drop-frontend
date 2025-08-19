import React from "react";
import Image from "next/image";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: React.ReactNode }) {

  let currentUser = null;
  try {
    currentUser = await getCurrentUser();
  } catch (error) {

    console.log("No active session found - user is on auth screen");
  }

  if (currentUser) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 sm:p-8 lg:p-16 relative">
      {/* Background Pattern - Full Screen Coverage */}
      <div 
        className="absolute inset-0 opacity-20 lg:opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0',
          zIndex: 0,
        }}
      />
      
      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg">

        <div className="text-center mb-8">
          <Link href='/' className="inline-block mb-6">
            <Image
              src="/assets/images/logo-datadrop.png"
              alt="DataDrop Logo"
              width={342}
              height={342}
              className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] lg:w-[160px] lg:h-[160px] transition-all hover:rotate-2 hover:scale-105"
            />
          </Link>
          
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-4 text-black">
            Manage your files the best way
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Upload, organize, and access your files from anywhere. Perfect for teams, freelancers, and anyone who needs reliable cloud storage.
          </p>
        </div>


        <div className="bg-white p-6 sm:p-8 border-2 border-black shadow-neo">
          {children}
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}
