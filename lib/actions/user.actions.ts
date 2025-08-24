"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId!,
    appwriteConfig.usersCollectionId!,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const createAccount = async ({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: any;
}) => {
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { databases } = await createAdminClient();

  const newUser = await databases.createDocument(
    appwriteConfig.databaseId!,
    appwriteConfig.usersCollectionId!,
    ID.unique(),
    {
      fullName,
      email,
      password: hashedPassword,
      avatar: avatarPlaceholderUrl,
    },
  );

  return parseStringify(newUser);
};

export const signInUser = async ({
  email,
  password,
}: {
  email: string;
  password: any;
}) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (!existingUser.password) {
      throw new Error("Account does not have a password. Please sign up again.");
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: existingUser.$id,
        email: existingUser.email,
        fullName: existingUser.fullName,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    cookies().set("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return parseStringify({ success: true });
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};

const getUserById = async (userId: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId!,
    appwriteConfig.usersCollectionId!,
    [Query.equal("$id", [userId])],
  );

  return result.total > 0 ? result.documents[0] : null;
}

export const getCurrentUser = async () => {
  try {
    const token = (await cookies()).get("jwt")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await getUserById(decoded.id);

    if (!user) {
      return null;
    }

    return parseStringify(user);
  } catch (error) {
    return null;
  }
};

export const signOutUser = async () => {
  try {
    cookies().delete("jwt");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};