// obriens pub getting the data from the page
function obriens() {
  const axios = require('axios');
  const cheerio = require('cheerio');

  // Prisma client import
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  // URL to scrape
  const url = 'https://obrienspubboston.com/show/';  // Use the correct URL

  // Fetch the webpage content
  axios.get(url)
    .then(async (response) => {
      const $ = cheerio.load(response.data);

      // Store events in an array
      const events = [];
      
      // Loop through each event entry (each <div> with class "uncode-post-table-column")
      $('div.uncode-post-table-column').each((index, element) => {
        const title = $(element).find('h4.t-entry-title a').text();  // Get event title
        const link = $(element).find('h4.t-entry-title a').attr('href');  // Get event link
        const dateTimeText = $(element).find('div.t-entry-excerpt p').text(); // Get the text for date, time, and age restriction

        // Parse date, time, and age from the dateTimeText
        const dateTimeParts = dateTimeText.split(' ');
        const date = new Date(dateTimeParts[1] + ' ' + dateTimeParts[2]); // Assuming date is in format "Thursday, December 26"
        const startTime = dateTimeParts[3];  // "8PM" (you may need to adjust this parsing if time is in a different format)
        const age = dateTimeParts[4] || '';  // "21+" (optional)

        // Venue and price are fixed, as per your requirements
        const venue = 'O\'Brien\'s Pub';
        const price = 15;

        // Split the title into bands (based on "/")
        const bands = title.split('/').map(band => band.trim());

        // Add the event to the events array
        events.push({
          bands,      // Array of band names
          link,
          date,
          startTime,
          age,
          venue,
          price,
        });
      });

      // Step 2: Save to Prisma database
      try {
        for (const event of events) {
          await prisma.event.create({
            data: {
              title: event.title,
              link: event.link,
              date: event.date,
              startTime: event.startTime,
              age: parseInt(event.age.replace('+', ''), 10) || null,  // Clean and parse age
              venue: event.venue,
              price: event.price,
              bands: event.bands,  // Save the array of bands
            },
          });
        }
        console.log('Data saved successfully!');
      } catch (err) {
        console.error('Error saving data to the database:', err);
      }

    })
    .catch((error) => {
      console.error('Error fetching the page:', error);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  }

module.exports.obriens;  // Export the function for use in the main script