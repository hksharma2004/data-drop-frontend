"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const createFileRecord = async ({
  fileId,
  ownerId,
  path,
  parentId = null,
}: {
  fileId: string;
  ownerId: string;
  path: string;
  parentId?: string | null;
}) => {
  const { storage, databases } = await createAdminClient();

  try {
    const bucketFile = await storage.getFile(appwriteConfig.bucketId, fileId);

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      users: [],
      bucketFileId: bucketFile.$id,
      parentId: parentId,
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument,
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to create file record");
  }
};

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  parentId: string | null,
  limit?: number,
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (parentId) {
    queries.push(Query.equal("parentId", [parentId]));
  }

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");
    const fieldMapping: { [key: string]: string } = { name: "name", date: "$createdAt", "$createdAt": "$createdAt" };
    const actualField = fieldMapping[sortBy] || sortBy;
    queries.push(orderBy === "asc" ? Query.orderAsc(actualField) : Query.orderDesc(actualField));
  }

  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  parentId = null,
  limit,
}: GetFilesProps & { parentId?: string | null }) => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");
    const queries = createQueries(currentUser, types, searchText, sort, parentId, limit);
    const files = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      queries,
    );
    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

export const renameFile = async ({ fileId, name, extension, path }: RenameFileProps) => {
  const { databases } = await createAdminClient();
  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      fileId,
      { name: newName },
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

export const updateFileUsers = async ({ fileId, emails, path }: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");
    const file = await databases.getDocument(appwriteConfig.databaseId!, appwriteConfig.filesCollectionId!, fileId);
    if (file.owner.$id !== currentUser.$id) {
      throw new Error("Only file owner can modify sharing settings");
    }
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      fileId,
      { users: emails },
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to update file sharing");
  }
};

export const deleteFile = async ({ fileId, bucketFileId, path }: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();
  try {
    const deletedFile = await databases.deleteDocument(appwriteConfig.databaseId!, appwriteConfig.filesCollectionId!, fileId);
    if (deletedFile && bucketFileId) {
      await storage.deleteFile(appwriteConfig.bucketId!, bucketFileId);
    }
    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to delete file");
  }
};

export const createFolder = async ({ folderName, parentId = null, path }: { folderName: string; parentId?: string | null; path: string; }) => {
  const { databases } = await createAdminClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("User not found");
  try {
    const newFolder = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.foldersCollectionId, 
      ID.unique(),
      {
        name: folderName,
        owner: currentUser.$id,
        parentId: parentId,
      }
    );
    revalidatePath(path);
    return parseStringify(newFolder);
  } catch (error) {
    handleError(error, "Failed to create folder");
  }
};

export const moveFilesToFolder = async ({ fileIds, folderId, path }: { fileIds: string[]; folderId: string; path: string; }) => {
  const { databases } = await createAdminClient();
  try {
    const updatePromises = fileIds.map(fileId => {
      return databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.filesCollectionId, fileId, { parentId: folderId });
    });
    await Promise.all(updatePromises);
    revalidatePath(path);
    return parseStringify({ success: true });
  } catch (error) {
    handleError(error, "Failed to move files");
  }
};

export const getFolders = async ({ parentId = null }: { parentId?: string | null } = {}) => {
  const { databases } = await createAdminClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("User not found");
  try {
    const queries = [Query.equal("owner", [currentUser.$id])];
    if (parentId) {
      queries.push(Query.equal("parentId", [parentId]));
    } else {
      queries.push(Query.isNull("parentId"));
    }
    const folders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.foldersCollectionId,
      queries
    );
    return parseStringify(folders.documents);
  } catch (error) {
    handleError(error, "Failed to get folders");
  }
};

export const getFolderPath = async (folderId: string | null) => {
  if (!folderId) return [];
  const { databases } = await createAdminClient();
  const path = [];
  let currentFolderId: string | null = folderId;
  while (currentFolderId) {
    try {
      const folder = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.foldersCollectionId, // Use folders collection
        currentFolderId
      );
      path.unshift({ id: folder.$id, name: folder.name });
      currentFolderId = folder.parentId;
    } catch (error) {
      console.error(`Could not resolve folder path for ID: ${currentFolderId}`, error);
      currentFolderId = null;
    }
  }
  return path;
};

export const deleteFolder = async ({ folderId, path }: { folderId: string, path: string }) => {
    const { databases } = await createAdminClient();
    try {
        const files = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.filesCollectionId, [Query.equal('parentId', [folderId]), Query.limit(1)]);
        if (files.total > 0) throw new Error("Cannot delete a folder that contains files.");
        const subFolders = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.foldersCollectionId, [Query.equal('parentId', [folderId]), Query.limit(1)]);
        if (subFolders.total > 0) throw new Error("Cannot delete a folder that contains sub-folders.");
        await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.foldersCollectionId, folderId);
        revalidatePath(path);
        return parseStringify({ success: true });
    } catch (error) {
        handleError(error, "Failed to delete folder");
    }
}

export async function getTotalSpaceUsed() {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");
    const files = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      [Query.equal("owner", [currentUser.$id])],
    );
    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024,
    };
    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      if (totalSpace[fileType]) {
        totalSpace[fileType].size += file.size;
        if (!totalSpace[fileType].latestDate || new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)) {
          totalSpace[fileType].latestDate = file.$updatedAt;
        }
      }
      totalSpace.used += file.size;
    });
    return parseStringify(totalSpace);
  } catch (error) {
    console.error("Error calculating total space used:", error);
    return {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024,
    };
  }
}