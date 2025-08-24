"use client";

import { Client, Storage } from 'appwrite';
import { appwriteConfig } from './config';

const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl!)
    .setProject(appwriteConfig.projectId!);

const storage = new Storage(client);

export { client, storage };
