import { NextRequest, NextResponse } from 'next/server';
import { addEntryToNotion, WaitlistEntry } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { name, email, ownsMetaQuest, ownsVisionPro } = await request.json();
    
    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Create entry object
    const entry: WaitlistEntry = {
      name,
      email,
      ownsMetaQuest: ownsMetaQuest || false,
      ownsVisionPro: ownsVisionPro || false
    };

    // Send to Notion
    await addEntryToNotion(entry);

    return NextResponse.json(
      { success: true, message: "Added to waitlist successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing waitlist submission:', error);
    
    // Format the error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
} 