import { useEffect } from 'react';

export default function TailwindLoader() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    script.async = true;
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  return null;
}
