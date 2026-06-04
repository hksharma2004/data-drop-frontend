import { NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { constructFileUrl, getFileType } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { MAX_FILE_SIZE } from "@/constants";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const ownerId = formData.get("ownerId");
  const path = formData.get("path");
  const parentId = formData.get("parentId");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File exceeds the 50 MB limit" }, { status: 413 });
  }

  if (ownerId !== currentUser.$id) {
    return NextResponse.json({ error: "Invalid owner" }, { status: 403 });
  }

  const { storage, databases } = await createAdminClient();
  const arrayBuffer = await file.arrayBuffer();
  const inputFile = InputFile.fromBuffer(Buffer.from(arrayBuffer), file.name);
  let bucketFileId: string | null = null;

  try {
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId!,
      ID.unique(),
      inputFile,
    );
    bucketFileId = bucketFile.$id;

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: currentUser.$id,
      users: [],
      bucketFileId: bucketFile.$id,
      parentId: typeof parentId === "string" && parentId.length > 0 ? parentId : null,
    };

    const newFile = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.filesCollectionId!,
      ID.unique(),
      fileDocument,
    );

    if (typeof path === "string") {
      revalidatePath(path);
    }

    return NextResponse.json({ file: newFile }, { status: 201 });
  } catch (error) {
    if (bucketFileId) {
      await storage.deleteFile(appwriteConfig.bucketId!, bucketFileId).catch(() => null);
    }

    console.error("Failed to upload file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
