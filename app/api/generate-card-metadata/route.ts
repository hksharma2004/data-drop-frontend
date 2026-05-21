import { NextResponse } from 'next/server';
import { generateJsonWithOpenRouter } from '@/lib/ai/openrouter';


interface FileMetadata {
    name: string;
    size: number;
}


interface GenerateMetadataRequestBody {
    files: FileMetadata[];
}


interface GeneratedContent {
    name: string;
    description: string;
    tags: string[];
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as GenerateMetadataRequestBody;
        const { files } = body;


        if (!files || !Array.isArray(files) || files.length === 0) {
            return NextResponse.json({ error: 'File metadata is required.' }, { status: 400 });
        }
        
        const fileList = files.map(f => `- ${f.name} (${Math.round(f.size / 1024)} KB)`).join('\n');
        const prompt = `
            Based on the following list of files, please generate a concise and professional card name, a 2-3 sentence description, and an array of relevant tags for the collection.

            File List:
            ${fileList}

            Guidelines:
            - The name should be a short, descriptive title for the entire file collection, max 50 characters.
            - The description should summarize the purpose and content of the files in 2-3 professional sentences.
            - The tags should be an array of 3-5 relevant, single-word, lowercase strings.
            - The tone should be professional and contextual.
            - Analyze file relationships and naming patterns (e.g., "Q1", "Report", "ClientX").
            - Return the output as a single, minified JSON object with three keys: "name", "description", and "tags". Do not include any other text or markdown formatting.

            Example Input:
            - Q1_sales_report.docx (150 KB)
            - market_analysis_Q1.pptx (2.5 MB)
            - competitor_research.pdf (800 KB)
            
            Example Output:
            {"name":"Q1 Business Intelligence Package","description":"Complete Q1 strategic analysis collection including sales performance report, market analysis presentation, and competitor research documentation. Essential materials for quarterly business review and strategic planning decisions.","tags":["q1", "business", "finance", "report", "analysis"]}
        `;

        const cleanedText = await generateJsonWithOpenRouter(prompt);
        const generatedJson: GeneratedContent = JSON.parse(cleanedText);

        return NextResponse.json(generatedJson, { status: 200 });

    } catch (error: unknown) {
        console.error('Error generating card metadata:', error);
        let errorMessage = 'An unexpected error occurred.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
