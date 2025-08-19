export const appwriteConfig = {
    endpointUrl : process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    projectId : process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
    databaseId : process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
    usersCollectionId : process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION,
    filesCollectionId : process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION,
    sharedCardsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SHARED_CARDS_COLLECTION,
    foldersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FOLDERS_COLLECTION,
    bucketId : process.env.NEXT_PUBLIC_APPWRITE_BUCKET,
    secretKey : process.env.NEXT_APPWRITE_KEY
};