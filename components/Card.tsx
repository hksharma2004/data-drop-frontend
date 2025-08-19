import { Models } from "node-appwrite";
import Link from "next/link";
import Thumbnail from "@/components/Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";

interface CardProps {
    file: Models.Document;
    onShareWithCard: (file: Models.Document) => void;
}

const Card = ({ file, onShareWithCard }: CardProps) => {
  return (
    <div className="file-card">
      <div className="flex flex-col gap-3 sm:gap-4 h-full">

        <div className="flex-1 min-w-0">
          <Link href={file.url} target="_blank" className="flex items-start gap-3 group">
            <Thumbnail
              type={file.type}
              extension={file.extension}
              url={file.url}
              className="!size-12 sm:!size-16 lg:!size-20 flex-shrink-0"
              imageClassName="!size-8 sm:!size-10 lg:!size-11"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-black truncate group-hover:text-[#FF7A3D] transition-colors duration-200 text-sm sm:text-base lg:text-lg">
                {file.name}
              </h3>
              <div className="flex flex-col gap-1 sm:gap-2 mt-1">
                <p className="text-xs sm:text-sm text-gray-600">
                  {convertFileSize(file.size)}
                </p>
                <FormattedDateTime
                  date={file.$createdAt}
                  className="text-xs text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">
                By: {file.owner.fullName}
              </p>
            </div>
          </Link>
        </div>


        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <ActionDropdown file={file} onShareWithCard={onShareWithCard} />
          <div className="text-right">
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              {convertFileSize(file.size)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;