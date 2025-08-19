"use client";

import React, { useEffect, useState } from 'react';
import CardItem from '@/components/CardItem';
import { toast } from 'sonner';
import ShareCardModal from '@/components/ShareCardModal'; 


interface SharedCard {
    cardId: string;
    name: string;
    description: string;
    createdAt: string;
    fileCount: number;
    totalSize: number;
}

const MyCardsPage = () => {
    const [cards, setCards] = useState<SharedCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await fetch('/api/my-cards');
                if (!response.ok) {
                    throw new Error('Failed to fetch cards');
                }
                const data = await response.json();
                setCards(data);
            } catch (error) {
                console.error(error);
                toast.error("Could not load your shared cards.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCards();
    }, []);


    const handleShare = (cardId: string) => {
        setSelectedCardId(cardId);
        setIsShareModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">My Shared Cards</h1>
                <div className="mt-8 text-center">
                    <p>Loading your cards...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-4 sm:p-6 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">My Shared Cards</h1>

                {cards.length === 0 ? (
                    <div className="mt-8 text-center">
                        <h3 className="text-lg font-semibold">No Cards Yet</h3>
                        <p className="text-muted-foreground">You haven't created any shared cards. Create one from the dashboard!</p>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {cards.map((card) => (
                            <CardItem key={card.cardId} card={card} onShare={handleShare} />
                        ))}
                    </div>
                )}
            </div>


            <ShareCardModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                cardId={selectedCardId}
            />
        </>
    );
};

export default MyCardsPage;
