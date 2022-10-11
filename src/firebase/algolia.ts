import algoliasearch from "algoliasearch/lite";

const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID as string;
const ALGOLIA_API_KEY = process.env.REACT_APP_ALGOLIA_API_KEY as string;
const ALGOLIA_INDEX_NAME = process.env.REACT_APP_ALGOLIA_INDEX_NAME as string;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
export const index = client.initIndex(ALGOLIA_INDEX_NAME);
