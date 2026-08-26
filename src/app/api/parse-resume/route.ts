import { NextRequest, NextResponse } from "next/server";
import { PortfolioData } from "@/types/portfolio";
import { extractText } from "unpdf";

/**
 * Extract text from PDF buffer using unpdf
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    const data = new Uint8Array(buffer);
    const { text } = await extractText(data);
    return text.join("\n");
}

/**
 * Use Perplexity API (sonar-pro) to parse extracted resume text into structured data
 */
async function parseResumeWithAI(fileBuffer: ArrayBuffer, fileName: string): Promise<PortfolioData> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not defined in environment variables");
    }

    console.log("Extracting text from PDF...");
    const pdfBuffer = Buffer.from(fileBuffer);
    let resumeText = "";

    try {
        resumeText = await extractTextFromPDF(pdfBuffer);
    } catch (error) {
        console.error("PDF text extraction failed:", error);
        throw new Error("Failed to extract text from PDF file");
    }

    const prompt = `
    You are an expert resume parser. I'm providing you with the text extracted from a resume file (${fileName}).
    
    Please extract and structure the resume information into the following JSON format.
    
    Required JSON Structure:
    {
        "personalInfo": {
            "name": "Full Name from resume",
            "title": "Current Job Title or Professional Headline",
            "bio": "Professional summary (max 300 chars)",
            "email": "Email Address"
        },
        "socialProfiles": {
            "github": "GitHub Profile URL",
            "linkedin": "LinkedIn Profile URL",
            "leetcode": "LeetCode Profile URL",
            "hackerrank": "HackerRank Profile URL",
            "geeksforgeeks": "GeeksforGeeks Profile URL",
            "codeforces": "Codeforces Profile URL",
            "codechef": "CodeChef Profile URL",
            "kaggle": "Kaggle Profile URL"
        },
        "skills": [
            {
                "category": "Category Name (e.g., Languages, Frameworks, Tools)",
                "items": ["Skill 1", "Skill 2"]
            }
        ], // Extract skills grouped by category headers found in the resume (e.g., "Languages:", "Technologies:")
        "experience": [
            {
                "company": "Company Name",
                "role": "Job Title",
                "date": "Date Range (e.g., Jun 2023 - Aug 2023)",
                "description": "Brief summary of key achievements (max 2 sentences)"
            }
        ],
        "projects": [
            {
                "title": "Project Name",
                "techStack": ["Tech 1", "Tech 2"],
                "githubUrl": "GitHub/Source Code URL (if found, else empty string)",
                "liveUrl": "Live Demo/Deployment URL (if found, else empty string)",
                "bullets": ["Detail point 1", "Detail point 2", "Detail point 3"] // Capture ALL descriptive text and bullet points here
            }
        ],
        "education": [
            {
                "degree": "Degree Name (e.g., B.Tech Computer Science)",
                "institute": "University/Institute Name",
                "year": "Year of Graduation or Duration (e.g., 2023 or 2019-2023)",
                "score": "GPA/Percentage (e.g., 3.8 GPA or 90%)"
            }
        ], // Extract education details here. DO NOT put them in customSections.
        "certifications": [
            {
                "name": "Certification Name",
                "issuer": "Issuing Organization",
                "link": "Credential URL (optional)"
            }
        ],
        "publications": [
            {
                "title": "Publication Title",
                "summary": "Brief summary",
                "link": "Link to publication (optional)"
            }
        ],
        "extracurricular": [
            {
                "role": "Role/Position",
                "organization": "Organization Name"
            }
        ],
        "achievements": ["Achievement 1", "Achievement 2"],
        "coursework": ["Course 1", "Course 2"],
        "customSections": [
            {
                "title": "Section Title (e.g., Awards, Achievements)",
                "items": ["Item 1", "Item 2"]
            }
        ] // Optional: Any other relevant sections found in the resume. ABSOLUTELY DO NOT include Education/Academics here.
    }

    Rules:
    1. Return ONLY the JSON object. No markdown formatting, no code blocks, no backticks.
    2. If a field is missing from the resume, use a reasonable placeholder or empty string.
    3. Ensure the JSON is valid and matches the structure exactly.
    4. Analyze the provided text carefully.
    7. **Education Categorization**:
       - Any section titled 'Education', 'Academics', 'Qualifications', 'University', or similar MUST be mapped to the "education" array.
       - DO NOT place these details in "customSections".
       - Ensure "degree", "institute", "year", and "score" are extracted if available.
    8. **New Sections**:
       - Extract Certifications, Publications, Extracurricular Activities, and Coursework into their respective arrays.
       - Do NOT put them in "customSections".

    Resume Text:
    ${resumeText}
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that extracts and structures resume data from text into JSON format. You must return ONLY valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.1
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Groq API error: ${response.status} - ${errorText} `);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Clean up any markdown code blocks if present (just in case)
        const jsonString = content.replace(/```json\n|\n```/g, "").replace(/```/g, "").trim();

        const parsedData = JSON.parse(jsonString) as PortfolioData;
        return parsedData;
    } catch (error) {
        console.error("AI parsing failed:", error);
        throw new Error("Failed to parse resume with Groq AI");
    }
}

// Force Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        console.log("=== Resume upload API called ===");
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            console.error("No file uploaded");
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        console.log("File received:", file.name, file.type, file.size);

        // Read the file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        console.log("File buffer created, sending to Perplexity for parsing...");

        // Parse the PDF directly with Groq AI
        let parsedData: PortfolioData;
        try {
            parsedData = await parseResumeWithAI(arrayBuffer, file.name);
            console.log("Resume parsed successfully by Groq");
        } catch (aiError) {
            console.error("AI Parsing failed:", aiError);
            return NextResponse.json({
                error: "Failed to parse resume with Groq AI. Please check your API key and try again."
            }, { status: 500 });
        }

        // Return parsed data without saving (user will review and approve first)
        console.log("Returning parsed data for review");
        return NextResponse.json({ success: true, data: parsedData });
    } catch (error) {
        console.error("=== Error processing resume ===");
        console.error(error);
        return NextResponse.json(
            { error: "Failed to process resume" },
            { status: 500 }
        );
    }
}
