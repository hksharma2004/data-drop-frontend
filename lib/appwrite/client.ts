"use client";

import { Client, Storage, Account } from 'appwrite';
import { appwriteConfig } from './config';

const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl!)
    .setProject(appwriteConfig.projectId!);

const account = new Account(client);
const storage = new Storage(client);

export { client, account, storage };
