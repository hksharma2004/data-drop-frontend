import { NextResponse } from 'next/server';

interface FileMetadata {
    name: string;
    size: number;
}

interface GenerateSuggestionsRequestBody {
    files: FileMetadata[];
}

interface GeminiAIResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
    }>;
}


type GeneratedSuggestions = Record<string, string[]>;

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as GenerateSuggestionsRequestBody;
        const { files } = body;

        if (!files || !Array.isArray(files) || files.length === 0) {
            return NextResponse.json({ error: 'File metadata is required.' }, { status: 400 });
        }

        const geminiAIApiKey = process.env.GEMINI_API_KEY_FOLDER_SUGGESTIONS;
        if (!geminiAIApiKey) {
            return NextResponse.json({ error: 'AI service is not configured.' }, { status: 500 });
        }

        const fileList = files.map(f => `- ${f.name}`).join('\\n');
        const prompt = `
            Based on the following list of file names, please suggest folder categories to organize them.

            File List:
            ${fileList}

            Guidelines:
            - Analyze the file names to identify logical groupings (e.g., by project, date, file type, or content).
            - Suggest 2-5 folder names.
            - For each suggested folder, provide a list of the file names that should be moved into it.
            - Return the output as a single, minified JSON object. The keys should be the suggested folder names (as strings), and the values should be arrays of the corresponding file names (as strings).
            - Do not include any files that do not fit into a suggested category. Every file from the input list does not need to be categorized.
            - Do not include any other text or markdown formatting in your response.

            Example Input:
            - resume_2023.pdf
            - project_alpha_report.docx
            - vacation_photo_1.jpg
            - project_alpha_data.xlsx
            - vacation_photo_2.png
            - company-logo.svg

            Example Output:
            {"Project Alpha":["project_alpha_report.docx","project_alpha_data.xlsx"],"Vacation Photos":["vacation_photo_1.jpg","vacation_photo_2.png"],"Miscellaneous":["resume_2023.pdf","company-logo.svg"]}
        `;

        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiAIApiKey}`;

        const response = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Gemini AI API request failed:', response.status, errorBody);
            throw new Error(`AI generation failed. Status: ${response.status}`);
        }

        const result: GeminiAIResponse = await response.json();

        const generatedText = result.candidates[0].content.parts[0].text;
        
        const sanitizedText = generatedText.replace(/\`\`\`json\n?|\n?\`\`\`/g, '').trim();

        const generatedJson: GeneratedSuggestions = JSON.parse(sanitizedText);

        return NextResponse.json(generatedJson, { status: 200 });

    } catch (error: unknown) {
        console.error('Error generating folder suggestions:', error);
        let errorMessage = 'An unexpected error occurred.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}