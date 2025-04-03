import { Client } from '@notionhq/client';

// Initialize Notion client
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Notion database ID
export const databaseId = process.env.NOTION_DATABASE_ID;

// Waitlist entry interface
export interface WaitlistEntry {
  name: string;
  email: string;
  phone?: string;
  ownsMetaQuest?: boolean;
  ownsVisionPro?: boolean;
}

// Add entry to Notion database
export async function addEntryToNotion(entry: WaitlistEntry) {
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not defined in environment variables');
  }
  
  if (!process.env.NOTION_API_KEY) {
    throw new Error('NOTION_API_KEY is not defined in environment variables');
  }
  
  try {
    // Create a new page in the Notion database
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: entry.name,
              },
            },
          ],
        },
        Email: {
          email: entry.email,
        },
        Phone: {
          phone_number: entry.phone || '',
        },
        "Meta Quest": {
          checkbox: entry.ownsMetaQuest || false,
        },
        "Vision Pro": {
          checkbox: entry.ownsVisionPro || false,
        },
        "Sign Up Date": {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });
    
    return response;
  } catch (error: unknown) {
    console.error('Error submitting to Notion:', error);
    
    // Extract Notion API error if available
    const errorMessage = error instanceof Error ? error.message : 'Failed to add entry to Notion database';
    const statusCode = error && typeof error === 'object' && 'status' in error ? error.status : 500;
    
    throw new Error(`Notion API Error (${statusCode}): ${errorMessage}`);
  }
} 