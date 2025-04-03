// Simple script to test Notion API connection
const { Client } = require('@notionhq/client');

// Initialize Notion client with the API key from .env.local
const notion = new Client({
  auth: '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' 
});

const databaseId = '1cac2c53-a70a-8033-b8bd-f2b914caf25a';

async function testConnection() {
  try {
    // Try to query the database to see if it exists and we have access
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });
    
    console.log('✅ Success! Connected to Notion database:');
    console.log('Database Title:', response.title[0]?.plain_text || response.title);
    console.log('Database ID:', response.id);
    console.log('Properties:', Object.keys(response.properties));
    
  } catch (error) {
    console.error('❌ Error connecting to Notion:');
    console.error(error.message);
    console.error('\nPossible fixes:');
    console.error('1. Verify your API key is correct');
    console.error('2. Make sure your Notion integration has been added to the database');
    console.error('   (Go to your database page → Share → Add connections → Select your integration)');
    console.error('3. Check that the database ID is correct');
    
    if (error.code === 'object_not_found') {
      console.error('\nThe database ID is in the correct format, but the database was not found.');
      console.error('This usually means:');
      console.error('- The database doesn\'t exist, OR');
      console.error('- Your integration doesn\'t have access to the database');
    }
  }
}

testConnection(); 