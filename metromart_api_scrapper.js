// scrape_all_metromart.js
const fs = require('fs').promises;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


// IMPORTANT: This token is temporary and will expire. You will need to get a new one
// from your browser's network tab if this script stops working.
const AUTH_TOKEN = 'Token eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTUzNDM5NDUsInR5cGUiOiJndWVzdCIsInNob3AtaWQiOjIxMDksImlhdCI6MTc1NDg5MzkyOX0.NjYJe08OoT--ofJTOwpLE67gNnyKeVLWn61TvI_7zQg';
const SHOP_ID = 2106; // SM Hypermarket Mall of Asia
const apiBaseUrl = 'https://api.metromart.com/api/v2';

const defaultHeaders = {
    'accept': 'application/vnd.api+json',
    'accept-language': 'en-US,en;q=0.9',
    'authorization': AUTH_TOKEN,
    'origin': 'https://www.metromart.com',
    'referer': 'https://www.metromart.com/',
    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build=MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
    'x-client-platform': 'Web'
};

// Fetches all departments for the specified shop.
async function fetchDepartments(shopId) {
    const url = `${apiBaseUrl}/shops/${shopId}/departments`;
    console.log('Fetching all departments...');
    try {
        const response = await fetch(url, { headers: defaultHeaders });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.data.map(dept => ({
            id: dept.id,
            name: dept.attributes.name
        }));
    } catch (error) {
        console.error('Failed to fetch departments:', error);
        return [];
    }
}

// Fetches all aisles for a given department.
async function fetchAisles(departmentId) {
    const url = `${apiBaseUrl}/departments/${departmentId}/aisles`;
    try {
        const response = await fetch(url, { headers: defaultHeaders });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.data.map(aisle => ({
            id: aisle.id,
            name: aisle.attributes.name,
            department_id: departmentId
        }));
    } catch (error) {
        console.error(`Failed to fetch aisles for department ${departmentId}:`, error);
        return [];
    }
}

// Fetches all brands for a given department, which is used for name formatting.
async function fetchBrands(departmentId) {
    const brands = [];
    const url = new URL(`${apiBaseUrl}/brands`);
    const params = {
        'fields[brands]': 'name',
        'filter[shop.id]': SHOP_ID,
        'filter[department.id]': departmentId,
        'filter[product.status]': 'available',
        'page[size]': 100, // Fetch up to 100 brands per department
        'sort': 'name'
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url, { headers: defaultHeaders });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.data) {
            brands.push(...data.data.map(brand => brand.attributes.name));
        }
    } catch (error) {
        console.error(`Failed to fetch brands for department ${departmentId}:`, error);
    }
    return brands.sort((a, b) => b.length - a.length); // Sort by length for better matching
}

// Fetches products for a specific aisle, paginating until all products are retrieved.
async function fetchAllAisleProducts(aisleId, aisleName, departmentName, brandList) {
    let allProducts = [];
    let pageNumber = 1;
    let hasMorePages = true;

    while (hasMorePages) {
        const url = new URL(`${apiBaseUrl}/products`);
        const params = {
            'include': 'brand,weights,take-y-weight,take-y-products,favorites,fmcg-campaign,fmcg-campaign.fmcg-campaign-vouchers,dhz-campaign-brand,department',
            'fields[products]': 'alcoholic,amount-in-cents,base-amount-in-cents,business-max-items-count,buy-x,buy-x-take-y,bulk,bulk-quantity-threshold,delicate,description,dhz-campaign-brand,dhz-campaign-brand-priority,image-url,image-740x740,max-items-count,name,percent-off,priority,require-legal-age,sari-sari-max-items-count,size,sold-as,status,take-y,weight-metric,weight-multiplier,weighted,weighted-disclaimer,fmcg-campaign,fmcg-campaign.fmcg-campaign-vouchers,department,aisle,shop,buy-x-weight,take-y-products,take-y-weight,weights',
            'filter[aisle.id]': aisleId,
            'filter[shop.id]': SHOP_ID,
            'filter[status]': 'available',
            'page[number]': pageNumber,
            'page[size]': 100,
            'sort': 'fmcg-campaign.status=[active],fmcg-campaign.kind=[free-delivery,peso-discount,free-shopping-fee,display-only],-monthly-popular-score,-updated-at'
        };

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        try {
            const response = await fetch(url, { headers: defaultHeaders });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            const productsOnPage = data.data.map(product => {
                let brand = 'N/A';
                let productName = product.attributes.name;
                
                // Find brand from product name based on brand list
                const matchingBrand = brandList.find(b => productName.toLowerCase().startsWith(b.toLowerCase()));
                if (matchingBrand) {
                    brand = matchingBrand;
                    productName = productName.substring(matchingBrand.length).trim();
                }

                // If brand is not found in name, check the relationships object
                if (brand === 'N/A' && product.relationships.brand?.data?.id) {
                    const brandObject = data.included?.find(inc => inc.type === 'brands' && inc.id === product.relationships.brand.data.id);
                    if (brandObject) {
                        brand = brandObject.attributes.name;
                    }
                }

                return {
                    product_id: product.id,
                    product_name: productName,
                    brand: brand,
                    price: product.attributes['amount-in-cents'] / 100,
                    size: product.attributes.size,
                    image_url: product.attributes['image-url'],
                    department: departmentName,
                    aisle: aisleName,
                    store: 'SM Hypermarket',
                    branch: 'Mall of Asia',
                };
            });
            allProducts.push(...productsOnPage);

            if (data.data.length === 0) {
                hasMorePages = false;
            } else {
                pageNumber++;
            }
        } catch (error) {
            console.error(`Error scraping aisle ${aisleId} on page ${pageNumber}:`, error);
            hasMorePages = false;
        }
    }
    return allProducts;
}

// Main function to orchestrate the entire scraping process
async function scrapeAllDepartments() {
    console.log('Starting full MetroMart API scraping...');
    const allProducts = [];
    const allBrands = {};

    const departments = await fetchDepartments(SHOP_ID);
    console.log(`Found ${departments.length} departments.`);

    for (const department of departments) {
        console.log(`\n> Scraping Department: ${department.name} (ID: ${department.id})`);
        const departmentBrands = await fetchBrands(department.id);
        allBrands[department.name] = departmentBrands;

        const aisles = await fetchAisles(department.id);
        const filteredAisles = aisles.filter(aisle => aisle.name.toLowerCase() !== 'all');
        console.log(`  Found ${filteredAisles.length} aisles to scrape.`);

        for (const aisle of filteredAisles) {
            console.log(`  - Scraping Aisle: ${aisle.name} (ID: ${aisle.id})`);
            const products = await fetchAllAisleProducts(aisle.id, aisle.name, department.name, departmentBrands);
            allProducts.push(...products);
            console.log(`  - Scraped ${products.length} products from aisle "${aisle.name}".`);
        }
    }

    const outputData = {
        brands_by_department: allBrands,
        products: allProducts,
        metadata: {
            store: 'SM Hypermarket',
            branch: 'Mall of Asia',
            scrape_date: new Date().toISOString()
        }
    };

    const fileName = 'metromart_all_products.json';
    await fs.writeFile(fileName, JSON.stringify(outputData, null, 2));
    console.log(`\nSuccessfully scraped a total of ${allProducts.length} products and saved to ${fileName}`);
}

scrapeAllDepartments();