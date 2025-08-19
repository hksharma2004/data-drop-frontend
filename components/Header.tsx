import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <header className="!flex !items-center !justify-between !gap-6 !p-6 bg-white shadow-sm border-b-2 border-black">
      <div className="flex-1">
        <Search />
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:block">
          <FileUploader ownerId={userId} accountId={accountId} />
        </div>

        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
          className="flex justify-end"
        >
          <Button
            type="submit"
            className="!h-[52px] !min-w-[54px] !p-3 !rounded-none
              hover:bg-[#FF7A3D]/10 active:bg-[#E5672A]/20 
              transition-all duration-300 shadow-neo border-2 border-black
              bg-white text-[#FF7A3D] hover:shadow-neo-hover"
          >
            <Image
              src="/assets/icons/logout.svg"
              alt="logout"
              width={20}
              height={20}
              className="w-6 h-6 transition-transform hover:scale-110 hover:rotate-12"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
