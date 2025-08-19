"use client";

import React from 'react';
import { Button } from './ui/button';
import { formatBytes } from '@/lib/utils';


interface SharedCard {
    cardId: string;
    name: string;
    description: string;
    createdAt: string;
    fileCount: number;
    totalSize: number;
    tags?: string[];
}

interface CardItemProps {
    card: SharedCard;
    onShare: (cardId: string) => void; 
}

const CardItem = ({ card, onShare }: CardItemProps) => {
    return (
        <div className="flex flex-col justify-between p-4 border rounded-lg shadow-sm bg-card text-card-foreground h-full">
            <div>
                <h4 className="font-semibold truncate text-lg">{card.name}</h4>
                <p className="text-sm text-muted-foreground mt-1 h-10 overflow-hidden">
                    {card.description || 'No description provided.'}
                </p>
                {card.tags && card.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {card.tags.map((tag, index) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 text-xs font-medium rounded-full border"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4">
                <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{card.fileCount} {card.fileCount === 1 ? 'file' : 'files'}</span>
                    <span>{formatBytes(card.totalSize)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    Created on: {new Date(card.createdAt).toLocaleDateString()}
                </p>
                <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => onShare(card.cardId)}
                >
                    Share
                </Button>
            </div>
        </div>
    );
};

export default CardItem;
