"use client";


import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/file.actions";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { usePathname, useRouter } from "next/navigation";
import { FileDetails, ShareInput } from "@/components/ActionModalContent";

interface ActionDropdownProps {
    file: Models.Document;
    onShareWithCard: (file: Models.Document) => void;
}

const ActionDropdown = ({ file, onShareWithCard }: ActionDropdownProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<any | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>(file.users || []);
  const [inputEmail, setInputEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { user } = useCurrentUser();

  const path = usePathname();
  const router = useRouter();

  const filteredActions = useMemo(() => {
    if (!user) return actionsDropdownItems;

    const isOwner = file.userId === user.$id;

    if (isOwner) {
      return actionsDropdownItems;
    } else {
      return actionsDropdownItems.filter(
        (item) =>
          !["rename", "share", "share-card"].includes(item.value)
      );
    }
  }, [file, user]);

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    setEmails([]);
    setError(null);
    setIsLoading(false);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    setError(null);

    try {
      const actions:any = {
        rename: () =>
          renameFile({ fileId: file.$id, name, extension: file.extension, path }),
        share: () => updateFileUsers({ fileId: file.$id, emails: Array.from(new Set(emails.map(e => e.toLowerCase()))), path }),
        delete: () =>
          deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path }),
      };

      const result = await actions[action.value as keyof typeof actions]();

      if (result) {
        closeAllModals();
        setTimeout(() => {
          router.refresh();
        }, 100);
      } else {
        setError("Action failed. Please try again.");
      }
    } catch (error) {
      console.error("Action failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (email: string) => {
    setError(null);
    
    try {
      const updatedEmails = emails.filter((e) => e.toLowerCase() !== email.toLowerCase());

      const result = await updateFileUsers({
        fileId: file.$id,
        emails: updatedEmails,
        path,
      });

      if (result) {
        setEmails(updatedEmails);
        setTimeout(() => {
          router.refresh();
        }, 100);
      } else {
        setError("Failed to remove user. Please try again.");
      }
    } catch (error) {
      console.error("Remove user failed:", error);
      setError("Failed to remove user. Please try again.");
    }
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              emails={emails}
              inputValue={inputEmail}
              setInputValue={setInputEmail}
              onAddEmails={(newEmails) => setEmails(prev => Array.from(new Set([...prev, ...newEmails])))}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{` `}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button hover:bg-[#FF7A3D]/10">
              Cancel
            </Button>
            <Button 
              onClick={handleAction} 
              className="modal-submit-button bg-[#FF7A3D] hover:bg-[#E5672A]"
              disabled={isLoading}
            >
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="!shadow-drop-3">
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filteredActions.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item hover:bg-[#FF7A3D]/10"
              onClick={() => {
                if (actionItem.value === 'share-card') {
                    onShareWithCard(file);
                    setIsDropdownOpen(false);
                } else if (
                  ["rename", "share", "delete", "details"].includes(
                    actionItem.value,
                  )
                ) {
                  setAction(actionItem);
                  setIsModalOpen(true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  <span className="group-hover:text-[#FF7A3D]">{actionItem.label}</span>
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};
export default ActionDropdown;