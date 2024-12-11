// Import required modules
const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape teams from the specified URL
async function scrapeGenshinTeams() {
    try {
        // Fetch the webpage content
        const { data } = await axios.get('https://gamewith.net/genshin-impact/article/show/38760');
        // Load the HTML into cheerio
        const $ = cheerio.load(data);

        // Initialize an array to store the teams
        const teams = [];

        // Locate each team section
        $('h2').each((index, headerElement) => {
            const teamName = $(headerElement).text().trim();
            const teamTable = $(headerElement).nextAll('.genshin_team').first();

            if (teamTable.length > 0) {
                const composition = {};

                // Traverse each row of the team table
                teamTable.find('table tr').each((rowIndex, rowElement) => {
                    const character = $(rowElement).find('td:nth-child(1) img').attr('alt');

                    if (character) {
                        composition[`character${rowIndex}`] = character;
                    }
                });

                const description = teamTable.next('p').text().trim();

                if (Object.keys(composition).length > 0) {
                    teams.push({
                        name: teamName,
                        composition,
                        description: description || 'No description available.' // Fallback if no description is found
                    });
                }
            }
        });

        // Log the structured teams
        console.log(JSON.stringify(teams, null, 2));
        return { teams };

    } catch (error) {
        console.error('Error fetching or parsing the webpage:', error);
        return null;
    }
}

// Call the function
scrapeGenshinTeams();