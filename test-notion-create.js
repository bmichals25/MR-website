// Script to create a new Notion database and then use it
const { Client } = require('@notionhq/client');

// Initialize Notion client with your API key
const notion = new Client({
  auth: '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'
});

async function createAndTestDatabase() {
  try {
    // Step 1: List all pages/databases the integration has access to
    console.log('Checking which pages your integration has access to...');
    const searchResponse = await notion.search({
      query: '',
      filter: {
        property: 'object',
        value: 'database'
      }
    });
    
    console.log(`Found ${searchResponse.results.length} accessible databases:`);
    if (searchResponse.results.length > 0) {
      searchResponse.results.forEach((db, index) => {
        const title = db.title?.[0]?.plain_text || 'Untitled Database';
        console.log(`[${index + 1}] ID: ${db.id} - Title: ${title}`);
      });
      
      // If there's at least one database, try to use the first one
      const firstDbId = searchResponse.results[0].id;
      console.log(`\nTrying to use the first database (ID: ${firstDbId})...`);
      
      // Test adding an entry to the first database
      await testAddEntry(firstDbId);
    } else {
      console.log('No databases found. Let\'s create a new one...');
      
      // Step 2: Find a page where we can create a database
      const pageSearchResponse = await notion.search({
        query: '',
        filter: {
          property: 'object',
          value: 'page'
        }
      });
      
      if (pageSearchResponse.results.length === 0) {
        console.log('No pages found that this integration has access to.');
        console.log('Please share at least one page with your integration in Notion.');
        return;
      }
      
      const pageId = pageSearchResponse.results[0].id;
      console.log(`Found page with ID: ${pageId}. Creating database in this page...`);
      
      // Step 3: Create a new database in the page
      const database = await notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: pageId
        },
        title: [
          {
            type: 'text',
            text: {
              content: 'Waitlist Database'
            }
          }
        ],
        properties: {
          Name: {
            title: {}
          },
          Email: {
            email: {}
          },
          'Meta Quest': {
            checkbox: {}
          },
          'Vision Pro': {
            checkbox: {}
          },
          'Sign Up Date': {
            date: {}
          }
        }
      });
      
      console.log('\n✅ Successfully created a new database!');
      console.log('Database ID:', database.id);
      console.log('URL:', `https://notion.so/${database.id.replace(/-/g, '')}`);
      
      // Step 4: Test adding an entry to the new database
      await testAddEntry(database.id);
      
      // Step 5: Update the .env.local file with the new database ID
      console.log('\n📝 Please update your .env.local file with this database ID:');
      console.log(`NOTION_DATABASE_ID=${database.id}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'unauthorized') {
      console.error('\nYour integration seems to lack necessary permissions.');
      console.error('Make sure you have:');
      console.error('1. Created a Notion integration at https://www.notion.so/my-integrations');
      console.error('2. Granted your integration access to at least one page in your workspace');
      console.error('   (Share > Add connections > [Your integration name])');
    }
  }
}

async function testAddEntry(databaseId) {
  try {
    // Create a test entry
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: 'Test Entry'
              }
            }
          ]
        },
        Email: {
          email: 'test@example.com'
        },
        'Meta Quest': {
          checkbox: true
        },
        'Vision Pro': {
          checkbox: false
        },
        'Sign Up Date': {
          date: {
            start: new Date().toISOString()
          }
        }
      }
    });
    
    console.log('\n✅ Successfully added a test entry to the database!');
    console.log('Entry ID:', response.id);
    
    return response;
  } catch (error) {
    console.error('\n❌ Failed to add entry to the database:', error.message);
    throw error;
  }
}

createAndTestDatabase(); 