export const getImageName = (url) => {
    try {
      // Extract the pathname from the URL
      const pathname = new URL(url).pathname;
      
      // Get the last segment (filename) from the path
      const filename = pathname.split('/').pop();
      
      return filename;
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  }