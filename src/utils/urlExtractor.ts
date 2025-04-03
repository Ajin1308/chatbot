// src/utils/urlExtractor.ts
export const extractSpecificUrls = (text: string) => {
    const urlRegex = /https:\/\/csrbotdemo\.atheniaai\.com\/\?product=\d+/g;
    return text.match(urlRegex);
  };
  
  export const fetchLinkMetadata = async (url: string) => {
    try {
      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return null;
    }
  };