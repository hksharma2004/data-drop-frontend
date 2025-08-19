"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }

      const files = await getFiles({ types: [], searchText: debouncedQuery });
      setResults(files.documents);
      setOpen(true);
    };

    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
    );
  };

  // for Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search relative">
      <div className="search-input-wrapper bg-white border-2 border-black shadow-neo hover:shadow-neo-hover focus-within:shadow-neo-active transition-all duration-200">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={20}
          height={20}
          className="ml-3 flex-shrink-0"
        />
        <Input
          value={query}
          placeholder="Search files..."
          className="search-input bg-transparent placeholder:text-gray-500 text-gray-700 px-3 py-3
            transition-all duration-200 border-none shadow-none focus:ring-0 focus:outline-none
            text-sm sm:text-base"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 bg-white border-2 border-black shadow-neo max-h-[400px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((file) => (
                <div
                  className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                  key={file.$id}
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-8 min-w-8 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate text-sm">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {file.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-2">
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="text-xs text-gray-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-gray-500 text-sm">No files found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;