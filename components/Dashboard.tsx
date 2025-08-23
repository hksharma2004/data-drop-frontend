"use client";

import React, { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Models } from "node-appwrite";
import { getFiles, getFolders, getFolderPath, getTotalSpaceUsed } from "@/lib/actions/file.actions";

import Card from "@/components/Card";
import CreateCardModal from "@/components/CreateCardModal";
import CreateFolderModal from "@/components/CreateFolderModal";
import ChatWithPdfModal from "@/components/ChatWithPdfModal";
import { Button } from "@/components/ui/button";
import { FileData } from "./CreateCardForm";
import StorageChart from "./StorageChart";
import UsageStats from "./UsageStats";
import Breadcrumbs from './Breadcrumbs';
import { formatBytes, getFileTypesParams } from "@/lib/utils";


const DashboardContent = () => {
    const searchParams = useSearchParams();
    const folderId = searchParams.get('folderId') || null;

    const [files, setFiles] = useState<Models.Document[]>([]);
    const [folders, setFolders] = useState<Models.Document[]>([]);
    const [folderPath, setFolderPath] = useState<{ id: string; name: string; }[]>([]);
    const [totalSpace, setTotalSpace] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);

    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [preSelectedFile, setPreSelectedFile] = useState<FileData | undefined>();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [filesData, foldersData, spaceData, pathData] = await Promise.all([
                getFiles({ types: [], parentId: folderId }),
                getFolders({ parentId: folderId }),
                getTotalSpaceUsed(),
                getFolderPath(folderId)
            ]);
            setFiles(filesData.documents);
            setFolders(foldersData);
            setTotalSpace(spaceData);
            setFolderPath(pathData);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [folderId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const 
        handleUploadEnd = () => {
            fetchData();
        };

        window.addEventListener("upload-end", handleUploadEnd);

        return () => {
            window.removeEventListener("upload-end", handleUploadEnd);
        };
    }, [fetchData]);

    const formattedFiles: FileData[] = useMemo(() => 
        files.map(file => ({
            $id: file.$id,
            name: file.name,
            size: file.size,
        })), [files]);

    const totalSize = useMemo(() => 
        files.reduce((acc, file) => acc + file.size, 0), [files]);

    const handleCategoryClick = async (categoryType: string) => {
        setIsFiltering(true);
        try {
            const types = getFileTypesParams(categoryType) as any[];
            const newFiles = await getFiles({ types, parentId: folderId });
            setFiles(newFiles.documents);
        } catch (error) {
            console.error("Failed to filter files:", error);
        } finally {
            setIsFiltering(false);
        }
    };
    
    const handleShareWithCard = (file: Models.Document) => {
        const fileToShare = formattedFiles.find(f => f.$id === file.$id);
        setPreSelectedFile(fileToShare);
        setIsCardModalOpen(true);
    };

    const openNewCardModal = () => {
        setPreSelectedFile(undefined); 
        setIsCardModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="page-container">
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-[var(--neo-primary)] rounded-full animate-spin"></div>
                    <p className="text-lg font-medium text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container p-2 sm:p-3 lg:p-6">
            <CreateCardModal isOpen={isCardModalOpen} onOpenChange={setIsCardModalOpen} files={formattedFiles} preSelectedFile={preSelectedFile} />
            <CreateFolderModal isOpen={isFolderModalOpen} onOpenChange={setIsFolderModalOpen} files={formattedFiles} />
            <ChatWithPdfModal isOpen={isChatModalOpen} onOpenChange={setIsChatModalOpen} />

            <section className="w-full">

                <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">Dashboard</h1>
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <Button 
                            variant="neo-orange" 
                            size="lg" 
                            onClick={() => setIsFolderModalOpen(true)}
                            className="w-full sm:w-auto text-sm lg:text-base h-12 sm:h-14 touch-manipulation"
                        >
                            Create Folder
                        </Button>
                        <Button 
                            variant="neo-orange" 
                            size="lg" 
                            onClick={openNewCardModal}
                            className="w-full sm:w-auto text-sm lg:text-base h-12 sm:h-14 touch-manipulation"
                        >
                            Create Share Card
                        </Button>
                        <Button 
                            variant="neo-orange" 
                            size="lg" 
                            onClick={() => setIsChatModalOpen(true)}
                            className="w-full sm:w-auto text-sm lg:text-base h-12 sm:h-14 touch-manipulation"
                        >
                            Chat with PDFs
                        </Button>
                    </div>
                </div>


                {totalSpace && !folderId && (
                    <div className="mb-4 sm:mb-6 lg:mb-8 p-3 sm:p-4 lg:p-6 bg-gray-50 border-2 lg:border-4 border-black shadow-neo">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-center">
                            <div className="lg:col-span-1 flex items-center justify-center">
                                <StorageChart used={totalSpace.used} total={totalSpace.all} />
                            </div>
                            <div className="lg:col-span-2">
                               <UsageStats totalSpace={totalSpace} />
                            </div>
                        </div>
                    </div>
                )}


                <div className="mb-3 sm:mb-4">
                    <Breadcrumbs path={folderPath} />
                </div>


                {!folderId && (
                    <>
                        <div className="mb-3 sm:mb-4">
                            <h2 className="text-lg sm:text-xl lg:text-2xl uppercase font-bold text-black">Folders</h2>
                        </div>
                        <section className="p-3 sm:p-4 lg:p-6 border-2 lg:border-4 border-black shadow-neo bg-white mb-4 sm:mb-6 lg:mb-8">
                            {folders.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
                                    {folders.map((folder) => (
                                        <Link key={folder.$id} href={`/dashboard?folderId=${folder.$id}`}>
                                            <div className="flex flex-col items-center gap-2 p-2 sm:p-3 lg:p-4 hover:bg-gray-100 cursor-pointer border-2 lg:border-4 border-black shadow-neo hover:shadow-neo-hover transition-all duration-200 touch-manipulation">
                                                <img src="/assets/icons/folder.svg" alt="folder" className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
                                                <p className="text-xs sm:text-sm lg:text-base font-medium text-center truncate w-full px-1">{folder.name}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full text-center py-4">
                                    <p className="font-bold text-black">No folders here.</p>
                                </div>
                            )}
                        </section>
                    </>
                )}


                {!folderId && (
                    <div className="mb-3 sm:mb-4 mt-4 sm:mt-6 lg:mt-8">
                        <h2 className="text-lg sm:text-xl lg:text-2xl uppercase font-bold text-black">Files</h2>
                    </div>
                )}


                <div className="mb-3 sm:mb-4 p-2 sm:p-3 lg:p-4 bg-gray-50 border-2 border-black shadow-neo">
                    <p className="text-xs sm:text-sm lg:text-base text-center">
                        Total Files: <span className="font-bold">{files.length}</span> | 
                        Total Size: <span className="font-bold break-words">{formatBytes(totalSize)}</span>
                    </p>
                </div>
            </section>
            

            {isFiltering ? (
                <div className="w-full text-center py-8 lg:py-12">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-[var(--neo-primary)] rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-gray-600">Filtering files...</p>
                    </div>
                </div>
            ) : files.length > 0 ? (
                 <section className="file-list">
                     {files.map((file) => (
                         <Card key={file.$id} file={file} onShareWithCard={handleShareWithCard} />
                     ))}
                 </section>
            ) : (
                <div className="w-full text-center py-8 lg:py-12 border-2 lg:border-4 border-black shadow-neo bg-white">
                    <p className="text-lg font-medium text-gray-600">This folder is empty.</p>
                </div>
            )}
        </div>
    );
};


const Dashboard = () => {
    return (
        <Suspense fallback={<div className="w-full text-center py-24">Loading...</div>}>
            <DashboardContent />
        </Suspense>
    );
};

export default Dashboard;