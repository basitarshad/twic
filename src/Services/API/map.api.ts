import algoliaSearch from 'algoliasearch';
import { APPLICATION_ID, SEARCH_API_KEY } from './marketplaceVendors.api';

const client = algoliaSearch(APPLICATION_ID, SEARCH_API_KEY);
const VENDOR_VENUES = client.initIndex('vendor_venue');

const searchVendorVenues = async (query, queryParams) => {
  try {
    const searchOptions = {
      hitsPerPage: 2000,
      facetFilters: ['inactive:false'],
      ...queryParams
    }

    const searchResults = await VENDOR_VENUES.search(query, searchOptions)
    return searchResults;
  } catch (error) {
    console.log('error')
    return [];
  }
}

export default {
  searchVendorVenues
}