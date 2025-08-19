import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owner.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};

interface Props {
  file: Models.Document;
  emails: string[];
  inputValue: string;
  setInputValue: (value: string) => void;
  onAddEmails: (emails: string[]) => void;
  onRemove: (email: string) => void;
}

export const ShareInput = ({ file, emails, inputValue, setInputValue, onAddEmails, onRemove }: Props) => {
  const { user, loading } = useCurrentUser();
  const isOwner = user?.$id === file.owner.$id;

  if (loading) {
    return <div>Loading...</div>;
  }

  // If not owner, show simplified view
  if (!isOwner) {
    return (
      <div className="share-wrapper">
        <ImageThumbnail file={file} />
        <div className="pt-4">
          <p className="subtitle-2 text-light-100">Shared by</p>
          <p className="subtitle-2">{file.owner.fullName}</p>
        </div>
      </div>
    );
  }

  const handleAddEmail = () => {
    if (!inputValue.trim()) return;

    const newEmails = inputValue
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0 && email.includes("@"));

    if (newEmails.length > 0) {
      onAddEmails(newEmails);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  // Show a combined list so new additions appear immediately before refresh
  const combinedEmails = Array.from(new Set([...(file.users || []), ...emails]));

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="share-input-field flex-1 focus:border-[#FF7A3D] focus:ring-2 focus:ring-[#FF7A3D]/20"
          />
          <Button 
            onClick={handleAddEmail}
            type="button"
            className="px-5 h-[44px] rounded-[8px] bg-[#FF7A3D]"
            disabled={!inputValue.trim()}
          >
            Add
          </Button>
        </div>
        
        {/* Only show shared users list to owner */}
        {isOwner && (
          <div className="pt-4">
            <div className="flex justify-between">
              <p className="subtitle-2 text-light-100">Shared with</p>
              <p className="subtitle-2 text-light-200">
                {combinedEmails.length} users
              </p>
            </div>
            
            <ul className="pt-2">
              {combinedEmails.map((email: string) => (
                <li key={email} className="flex items-center justify-between gap-2">
                  <p className="subtitle-2">{email}</p>
                  <Button
                    onClick={() => onRemove(email)}
                    className="rounded-full bg-transparent text-[#FF7A3D]"
                  >
                    <Image
                      src="/assets/icons/remove.svg"
                      alt="Remove"
                      width={24}
                      height={24}
                    />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};