
const { Client, Databases, ID, Permission, Role, RelationshipType, RelationMutate, IndexType } = require('node-appwrite');


require('dotenv').config({ path: '.env.local' });

const appwriteConfig = {
    endpointUrl : process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    projectId : process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
    databaseId : process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
    usersCollectionId : process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION,
    filesCollectionId : process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION,
    sharedCardsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SHARED_CARDS_COLLECTION,
    bucketId : process.env.NEXT_PUBLIC_APPWRITE_BUCKET,
    secretKey : process.env.NEXT_APPWRITE_KEY
};


const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl!)
    .setProject(appwriteConfig.projectId!)
    .setKey(appwriteConfig.secretKey!);

const databases = new Databases(client);

// --- Configuration ---
const DATABASE_ID = appwriteConfig.databaseId!;
const USERS_COLLECTION_ID = appwriteConfig.usersCollectionId!;
const FILES_COLLECTION_ID = appwriteConfig.filesCollectionId!;
const SHARED_CARDS_COLLECTION_ID = appwriteConfig.sharedCardsCollectionId!;

async function setupSharedCardsCollection() {
    try {
        await databases.getCollection(DATABASE_ID, SHARED_CARDS_COLLECTION_ID);
        console.log(`Collection 'shared_cards' already exists. Skipping creation.`);
        return;
    } catch (error: any) {
        if (error.code === 404) {
            console.log(`Collection 'shared_cards' not found. Creating...`);
            try {
                await databases.createCollection(
                    DATABASE_ID,
                    SHARED_CARDS_COLLECTION_ID,
                    'Shared Cards',
                    [
                        Permission.read(Role.any()),
                        Permission.create(Role.users()),
                        Permission.update(Role.users()),
                        Permission.delete(Role.users()),
                    ],
                    true
                );

                console.log(`Collection 'shared_cards' created successfully.`);

                console.log('Adding attributes...');
                await databases.createStringAttribute(DATABASE_ID, SHARED_CARDS_COLLECTION_ID, 'cardId', 32, true);
                await databases.createStringAttribute(DATABASE_ID, SHARED_CARDS_COLLECTION_ID, 'name', 255, true);
                await databases.createStringAttribute(DATABASE_ID, SHARED_CARDS_COLLECTION_ID, 'description', 1000, false);
                await databases.createIntegerAttribute(DATABASE_ID, SHARED_CARDS_COLLECTION_ID, 'totalSize', true, 0);

                console.log('Attributes created. Waiting a moment before creating relationships...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                console.log('Creating relationships...');
                await databases.createRelationshipAttribute(
                    DATABASE_ID,
                    SHARED_CARDS_COLLECTION_ID,
                    USERS_COLLECTION_ID,
                    RelationshipType.OneToMany,
                    false, 'owner', 'createdCards', RelationMutate.Restrict
                );
                await databases.createRelationshipAttribute(
                    DATABASE_ID,
                    SHARED_CARDS_COLLECTION_ID,
                    FILES_COLLECTION_ID,
                    RelationshipType.ManyToMany,
                    false, 'files', 'sharedInCards', RelationMutate.Cascade
                );

                console.log('Relationships created successfully. Waiting a moment before creating index...');
                await new Promise(resolve => setTimeout(resolve, 2000));

                console.log('Creating index on cardId...');
                await databases.createIndex(
                    DATABASE_ID,
                    SHARED_CARDS_COLLECTION_ID,
                    'idx_cardId',
                    IndexType.Unique,
                    ['cardId'],
                    ['asc']
                );
                console.log('Index created successfully.');

            } catch (e) {
                console.error('Error during collection setup:', e);
                throw e;
            }
        } else {
            console.error('Error checking for collection:', error);
            throw error;
        }
    }
}

async function main() {
    console.log('--- Starting Appwrite Setup Script ---');
    if (!appwriteConfig.secretKey) {
        console.error("Error: NEXT_APPWRITE_KEY is not set in your .env.local file.");
        process.exit(1);
    }
    try {
        await setupSharedCardsCollection();
        console.log('--- Appwrite Setup Script Finished Successfully ---');
    } catch (error) {
        console.error('--- Appwrite Setup Script Failed ---');
        process.exit(1);
    }
}

main();