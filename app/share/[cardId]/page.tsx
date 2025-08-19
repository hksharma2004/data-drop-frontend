import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from '@radix-ui/react-icons';
import { formatBytes, constructDownloadUrl } from '@/lib/utils';
import Image from 'next/image';

interface FileInfo {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
    extension: string;
    bucketFileId: string;
}

interface CardData {
    name: string;
    description: string;
    files: FileInfo[];
    tags: string[];
}


async function getCardData(cardId: string): Promise<CardData | null> {
    const hdrs = await headers();
    const host = hdrs.get('host');
    const isVercel = Boolean(process.env.VERCEL);
    const protocol = isVercel ? 'https' : 'http';
    const baseUrl = host ? `${protocol}://${host}` : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/cards/${cardId}`, {
        cache: 'no-store', 
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        const text = await response.text();
        console.error('Failed to fetch card data', response.status, text);
        throw new Error('Could not retrieve card data.');
    }

    return response.json();
}


const PublicSharePage = async ({ params }: { params: { cardId: string } }) => {
    const cardData = await getCardData(params.cardId);

    // If the card doesn't exist, show a 404 page
    if (!cardData) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-card border-2 border-black shadow-[8px_8px_0px_0px_#000] p-6 md:p-8">
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">{cardData.name}</h1>
                    {cardData.description && (
                        <p className="mt-2 text-muted-foreground">{cardData.description}</p>
                    )}
                    {cardData.tags && cardData.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 justify-center">
                            {cardData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 text-sm font-medium rounded-full border border-black"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                <div className="space-y-3">
                    {cardData.files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                            <div>
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
                            </div>
                            <Button asChild variant="secondary">
                                <a href={constructDownloadUrl(file.bucketFileId)}>
                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                    Download
                                </a>
                            </Button>
                        </div>
                    ))}
                </div>

                <footer className="text-center mt-8 text-sm text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                        <Image src="/assets/icons/logo-brand.svg" alt="Datadrop Logo" width={60} height={60} />
                        <div className="flex justify-center items-center gap-2">
                            <p>Shared via DataDrop</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PublicSharePage;