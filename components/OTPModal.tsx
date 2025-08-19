"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { verifySecret, sendEmailOTP } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const OtpModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // for detectiing whether if its is a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    console.log({ accountId, password });

    try {
      const sessionId = await verifySecret({ accountId, password });

      console.log({ sessionId });

      if (sessionId) {
        toast.success("OTP verified successfully! Redirecting to dashboard...");
        router.replace("/dashboard");
      }
    } catch (error) {
      console.log("Failed to verify OTP", error);
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    await sendEmailOTP({ email });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className={`shad-alert-dialog w-[95%] max-w-[400px] sm:max-w-[480px] p-4 sm:p-6 md:p-8 z-[9999] ${isMobile ? 'mobile-otp-modal' : ''}`}>
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center font-semibold text-lg sm:text-xl relative">
            Enter Your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close"
              width={20}
              height={20}
              onClick={handleClose}
              className="otp-close-button"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-sm sm:text-base">
            We&apos;ve sent a code to{" "}
            <span className="pl-1 font-normal text-[#666666]">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP 
          maxLength={6} 
          value={password} 
          onChange={setPassword}
          className="gap-2 sm:gap-3 md:gap-4" // responsive gap between digits
          autoFocus={!isMobile} // Auto-focus on desktop, not on mobile to avoid keyboard issues
        >
          <InputOTPGroup className="flex justify-center gap-2 sm:gap-3 md:gap-4"> 
            <InputOTPSlot 
              index={0} 
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg border-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#FF7A3D] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] active:border-[#FF7A3D]" // responsive sizing
            />
            <InputOTPSlot 
              index={1} 
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg border-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#FF7A3D] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] active:border-[#FF7A3D]"
            />
            <InputOTPSlot 
              index={2} 
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg border-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#FF7A3D] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] active:border-[#FF7A3D]"
            />
            <InputOTPSlot 
              index={3} 
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg border-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#FF7A3D] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] active:border-[#FF7A3D]"
            />
            <InputOTPSlot 
              index={4} 
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg border-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#FF7A3D] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] active:border-[#FF7A3D]"
            />
            <InputOTPSlot 
              index={5} 
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-lg border-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#FF7A3D] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] active:border-[#FF7A3D]"
            />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-3 sm:gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="h-10 sm:h-12 rounded-lg bg-[#FF7A3D] px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-white hover:bg-[#E5672A] hover:text-gray-300 transition-all duration-200"
              type="button"
            >
              Submit
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={20}
                  height={20}
                  className="ml-2 animate-spin"
                />
              )}
            </AlertDialogAction>

            <div className="subtitle-2 mt-2 text-center text-light-100 text-xs sm:text-sm">
              Didn&apos;t get a code?{" "}
              <span
                className="cursor-pointer text-[#FF7A3D] hover:text-[#FF7A3D]/90 underline"
                onClick={handleResendOtp}
              >
                Click to resend
              </span>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;