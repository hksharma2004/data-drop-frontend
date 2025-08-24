"use server";


import { Account, Avatars, Client, Databases, Storage } from 'node-appwrite'
import { appwriteConfig } from "./config"
import { cookies } from 'next/headers';

export const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl!)
        .setProject(appwriteConfig.projectId!)
        .setKey(appwriteConfig.secretKey!);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage(){
            return new Storage(client);
        },
        get avatars(){
            return new Avatars(client);
        }
    }
}
