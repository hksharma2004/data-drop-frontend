import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';


export async function GET(
    request: Request,
    { params }: { params: { cardId: string } }
) {
    try {
        const cardId = params.cardId;
        if (!cardId) {
            return NextResponse.json({ error: 'Card ID is required.' }, { status: 400 });
        }

        const { databases } = await createAdminClient();

        // find the card document using its unique id
        const cardResponse = await databases.listDocuments(
            appwriteConfig.databaseId!,
            appwriteConfig.sharedCardsCollectionId!,
            [Query.equal('cardId', cardId)]
        );

        if (cardResponse.total === 0) {
            return NextResponse.json({ error: 'Card not found.' }, { status: 404 });
        }

        const card = cardResponse.documents[0];

  
        const files = card.files.map((file: any) => ({
            id: file.$id,
            name: file.name,
            url: file.url,
            size: file.size,
            type: file.type,
            extension: file.extension,
            bucketFileId: file.bucketFileId,
        }));

        // format and return the card data back
        const publicCardData = {
            name: card.name,
            description: card.description,
            files: files,
            tags: card.tags || [],
        };

        return NextResponse.json(publicCardData, { status: 200 });

    } catch (error) {
        console.error(`Error fetching card ${params.cardId}:`, error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}