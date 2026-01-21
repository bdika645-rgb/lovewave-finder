import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}

const SEOHead = ({ 
  title, 
  description = 'Spark - אתר ההיכרויות המוביל בישראל. מצאו את האהבה האמיתית שלכם עוד היום!',
  keywords = 'היכרויות, דייטינג, אהבה, זוגיות, מציאת זוג, ישראל',
  image = 'https://lovable.dev/opengraph-image-p98pqg.png',
  url,
  type = 'website'
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Update document title
    document.title = `${title} | Spark`;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph tags
    updateMetaTag('og:title', `${title} | Spark`, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:type', type, true);
    if (url) {
      updateMetaTag('og:url', url, true);
    }
    
    // Twitter tags
    updateMetaTag('twitter:title', `${title} | Spark`);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:card', 'summary_large_image');

    // Cleanup - restore original title on unmount
    return () => {
      // Optional: Reset to default title
    };
  }, [title, description, keywords, image, url, type]);

  return null;
};

export default SEOHead;
