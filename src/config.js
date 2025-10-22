// Contentstack CMS Configuration
export const config = {
  contentstack: {
    apiKey: process.env.REACT_APP_CONTENTSTACK_API_KEY,
    accessToken: process.env.REACT_APP_CONTENTSTACK_ACCESS_TOKEN,
    environment: process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || "production",
    region: process.env.REACT_APP_CONTENTSTACK_REGION || "us",
  },
};
