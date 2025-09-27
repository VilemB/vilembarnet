import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://vilembarnet.vercel.app'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
} 