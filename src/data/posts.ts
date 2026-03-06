export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
}

export const posts: Post[] = [
  {
    id: '1',
    slug: 'why-custom-coding-is-better-for-seo',
    title: 'Why Custom Coding Can Be Better Than WordPress for SEO',
    excerpt: 'Discover how a custom-coded website can give you the edge in Core Web Vitals and search engine rankings.',
    content: `
## The Speed Advantage

When you build a custom website, you have absolute control over every line of code. Unlike WordPress, which often relies on bulky themes and numerous plugins that add unnecessary bloat, a custom site only loads exactly what it needs.

This lean approach translates directly to blazing-fast page load times. Google's Core Web Vitals heavily prioritize speed, meaning a faster site is more likely to rank higher in search results.

## Clean Architecture

Custom coding allows developers to structure the HTML semantics perfectly. Search engine crawlers love clean, well-organized code. By using the correct tags (like \`<article>\`, \`<section>\`, \`<header>\`, and proper heading hierarchies), you make it incredibly easy for Google to understand your content.

## Security and Uptime

WordPress powers over 40% of the web, making it a prime target for hackers. A compromised site will plummet in search rankings. Custom sites, being unique, are inherently less susceptible to automated, widespread attacks, ensuring better uptime and consistent SEO performance.
    `,
    date: '2026-03-04',
    author: 'Skye',
    readTime: '3 min read',
    tags: ['SEO', 'Web Development', 'Custom Code']
  },
  {
    id: '2',
    slug: 'getting-started-with-react-seo',
    title: 'Getting Started with React and SEO',
    excerpt: 'Learn how to make your Single Page Applications (SPAs) SEO-friendly using modern tools and techniques.',
    content: `
## The SPA Challenge

Historically, Single Page Applications (SPAs) built with React struggled with SEO because search engine crawlers had difficulty executing JavaScript to see the content.

## Modern Solutions

Today, we have excellent solutions:
1. **Server-Side Rendering (SSR):** Frameworks like Next.js render the React code on the server, sending fully formed HTML to the browser and crawlers.
2. **Static Site Generation (SSG):** Pages are pre-built at compile time, offering the ultimate speed and SEO benefits.
3. **Dynamic Meta Tags:** Using libraries like \`react-helmet-async\`, we can dynamically update the \`<title>\` and \`<meta>\` tags as the user navigates, ensuring each page is properly indexed.

By implementing these strategies, you can enjoy the rich user experience of React without sacrificing search engine visibility.
    `,
    date: '2026-03-01',
    author: 'Skye',
    readTime: '4 min read',
    tags: ['React', 'SEO', 'Frontend']
  }
];
