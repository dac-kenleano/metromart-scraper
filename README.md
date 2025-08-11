# Metromart Scraper

Usage:
```
node metromart_api_scrapper.js
```
feat: Scrape entire website by departments, aisles, and brands

This commit introduces a major feature to scrape all products from a given MetroMart shop ID. The script now leverages API endpoints to systematically fetch a complete list of products, departments, and aisles.

Key changes include:

API-based scraping: Replaced browser automation with direct API calls for efficiency.

Hierarchical data collection: Gathers products by iterating through departments and their respective aisles.

Improved data formatting: Separates product brand from the name using a pre-fetched list of brands.

Output format: Exports all scraped data into a single, well-structured JSON file.

Configurability: The AUTH_TOKEN and SHOP_ID can be easily changed to target different stores.

How to use this code
To use this code to scrape an entire MetroMart shop, follow these steps:

Get the authorization token: The AUTH_TOKEN in the script is temporary and will expire. To get a new one, open your browser's developer tools on www.metromart.com, go to the Network tab, find an API request (e.g., to /products or /departments), and copy the authorization header value. It's the part that starts with Token eyJ....

Get the shop ID: The SHOP_ID (e.g., 2106 for SM Hypermarket Mall of Asia) is also specific to the store. You can find this in the URL of the shop page, or in the API request URL when Browse the store.

Run the script: Save the code in a file (e.g., metromart_scraper.js), install node-fetch (npm install node-fetch), and run it using node metromart_scraper.js.

The script will produce a metromart_all_products.json file containing all the data.