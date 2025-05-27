/**
 * Load an external script dynamically
 * @param src The URL of the script to load
 * @returns A promise that resolves when the script is loaded
 */
export const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = (error) => reject(new Error(`Failed to load script: ${src}`));
    
    document.head.appendChild(script);
  });
};
