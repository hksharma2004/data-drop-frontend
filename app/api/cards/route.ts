import { NextResponse } from 'next/server';
import { createSessionClient, createAdminClient } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { nanoid } from 'nanoid';
import { ID, Query, Permission, Role, Models } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

interface NewCardData {
    cardId: string;
    name: string;
    description: string;
    totalSize: number;
    owner: string[];
    ownerId: string;
    files: string[];
    tags: string[];
}

interface CreateCardRequestBody {
    name: string;
    description?: string;
    fileIds: string[];
    tags?: string[];
}

export async function POST(request: Request) {
    try {
        const { databases: userDatabases, account } = await createSessionClient();
        const currentUser = await account.get();
        const body = (await request.json()) as CreateCardRequestBody;
        const { name, description, fileIds, tags } = body;

        if (!name || !fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
            return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
        }
        
        const { databases: adminDatabases } = await createAdminClient();
        const fileDocuments = await adminDatabases.listDocuments(
            appwriteConfig.databaseId!,
            appwriteConfig.filesCollectionId!,
            [Query.equal('$id', fileIds)]
        );

        if (fileDocuments.total !== fileIds.length) {
            return NextResponse.json({ error: 'One or more files not found.' }, { status: 404 });
        }

        const totalSize = fileDocuments.documents.reduce((acc, file) => acc + (file.size || 0), 0);
        const cardId = nanoid(12);

        const dataToCreate: NewCardData = {
            cardId,
            name,
            description: description || '',
            totalSize,
            owner: [currentUser.$id],
            ownerId: currentUser.$id,
            files: fileIds,
            tags: tags || [],
        };
        
        const newCard = await userDatabases.createDocument<Models.Document>(
            appwriteConfig.databaseId!,
            appwriteConfig.sharedCardsCollectionId!,
            ID.unique(),
            dataToCreate,
            [
                Permission.read(Role.user(currentUser.$id)),
                Permission.update(Role.user(currentUser.$id)),
                Permission.delete(Role.user(currentUser.$id)),
            ]
        );

        revalidatePath('/my-cards');
        revalidatePath('/dashboard');

        return NextResponse.json({
            message: 'Card created successfully!',
            card: {
                cardId: newCard.cardId,
                name: newCard.name,
                description: newCard.description,
            },
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating card:', error);
        const errorMessage = error.response?.message || 'An unexpected error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: error.code || 500 });
    }
}