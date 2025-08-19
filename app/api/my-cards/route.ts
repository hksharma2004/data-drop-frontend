import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { createAdminClient } from '@/lib/appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { Query } from 'node-appwrite';

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
        }

        const { databases } = await createAdminClient();


        const cardsResponse = await databases.listDocuments(
            appwriteConfig.databaseId!,
            appwriteConfig.sharedCardsCollectionId!,
            [Query.equal('ownerId', currentUser.accountId)] 
        );

        const userCards = await Promise.all(
            cardsResponse.documents.map(async (card) => {
                let totalSize = 0;
                if (card.files && card.files.length > 0) {
                    const fileIds = card.files.map((file: any) => file.$id);
                    if (fileIds.length > 0) {
                        const fileDocs = await databases.listDocuments(
                            appwriteConfig.databaseId!,
                            appwriteConfig.filesCollectionId!,
                            [Query.equal('$id', fileIds)]
                        );
                        totalSize = fileDocs.documents.reduce((acc, file) => acc + file.size, 0);
                    }
                }
                return {
                    cardId: card.$id,
                    name: card.name,
                    description: card.description,
                    createdAt: card.$createdAt,
                    fileCount: card.files ? card.files.length : 0,
                    totalSize,
                    tags: card.tags || [],
                };
            })
        );
        return NextResponse.json(userCards, { status: 200 });
    } catch (error) {
        console.error('Error fetching user cards:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
