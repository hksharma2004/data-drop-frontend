import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';


export async function GET(
    request: Request,
    { params }: { params: { cardId: string } }
) {
    try {

        const requiredEnv: Array<[string, string | undefined]> = [
            ['NEXT_PUBLIC_APPWRITE_ENDPOINT', appwriteConfig.endpointUrl],
            ['NEXT_PUBLIC_APPWRITE_PROJECT', appwriteConfig.projectId],
            ['NEXT_PUBLIC_APPWRITE_DATABASE', appwriteConfig.databaseId],
            ['NEXT_PUBLIC_APPWRITE_FILES_COLLECTION', appwriteConfig.filesCollectionId],
            ['NEXT_PUBLIC_APPWRITE_SHARED_CARDS_COLLECTION', appwriteConfig.sharedCardsCollectionId],
            ['NEXT_APPWRITE_KEY', appwriteConfig.secretKey],
        ];
        const missing = requiredEnv.filter(([, value]) => !value).map(([key]) => key);
        if (missing.length > 0) {
            return NextResponse.json(
                { error: `Missing required environment variables: ${missing.join(', ')}` },
                { status: 500 }
            );
        }
        const cardId = params.cardId;
        if (!cardId) {
            return NextResponse.json({ error: 'Card ID is required.' }, { status: 400 });
        }

        const { databases } = await createAdminClient();


        let cardResponse = await databases.listDocuments(
            appwriteConfig.databaseId!,
            appwriteConfig.sharedCardsCollectionId!,
            [Query.equal('cardId', cardId)]
        );


        if (cardResponse.total === 0) {
            try {
                const doc = await databases.getDocument(
                    appwriteConfig.databaseId!,
                    appwriteConfig.sharedCardsCollectionId!,
                    cardId
                );
                cardResponse = { total: 1, documents: [doc] } as any;
            } catch {
                return NextResponse.json({ error: 'Card not found.' }, { status: 404 });
            }
        }

        const card = cardResponse.documents[0];


        let files: any[] = [];
        try {
            const fileIds = (card.files || []).map((f: any) => (typeof f === 'string' ? f : f.$id));
            if (fileIds.length > 0) {
                const { databases } = await createAdminClient();
                const fileDocs = await databases.listDocuments(
                    appwriteConfig.databaseId!,
                    appwriteConfig.filesCollectionId!,
                    [Query.equal('$id', fileIds)]
                );
                files = fileDocs.documents.map((file: any) => ({
                    id: file.$id,
                    name: file.name,
                    url: file.url,
                    size: file.size,
                    type: file.type,
                    extension: file.extension,
                    bucketFileId: file.bucketFileId,
                }));
            }
        } catch (e) {

            files = (card.files || []).map((file: any) => ({
                id: file.$id ?? file.id ?? file,
                name: file.name ?? '',
                url: file.url ?? '',
                size: file.size ?? 0,
                type: file.type ?? '',
                extension: file.extension ?? '',
                bucketFileId: file.bucketFileId ?? file.bucket_id ?? '',
            }));
        }

        // format and return the card data back
        const publicCardData = {
            name: card.name,
            description: card.description,
            files: files,
            tags: card.tags || [],
        };

        return NextResponse.json(publicCardData, { status: 200 });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error fetching card ${params.cardId}:`, message);
        return NextResponse.json({ error: `Failed to fetch card: ${message}` }, { status: 500 });
    }
}