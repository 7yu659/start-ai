import { AITool, AdSettings, SiteSettings } from '../types';

export const initialTools: AITool[] = [
  {
    id: '1',
    slug: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    tagline: 'The ultimate AI assistant by OpenAI',
    description: "ChatGPT Plus offers priority access to OpenAI's most advanced models, including GPT-4, faster response times, and early access to new features like custom GPTs and advanced data analysis.",
    category: 'Chatbots',
    imageUrl: 'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&q=80&w=1000',
    pricing: '$20/month',
    rating: {
      overall: 4.8,
      easeOfUse: 4.9,
      features: 4.7,
      valueForMoney: 4.5,
      performance: 4.9
    },
    pros: ['Industry-leading reasoning capabilities', 'Custom GPT creation', 'Excellent coding assistance', 'Voice and vision capabilities'],
    cons: ['Can be slow during peak hours', 'Knowledge cutoff limitations', 'Subscription required for best features'],
    features: ['GPT-4 Access', 'DALL-E 3 Image Generation', 'Advanced Data Analysis', 'Web Browsing', 'Custom Instructions'],
    websiteUrl: 'https://chat.openai.com',
    content: `
ChatGPT Plus represents the gold standard in consumer AI chatbots. Powered by the formidable GPT-4 architecture, it transcends simple text generation to become a comprehensive digital assistant capable of complex reasoning, creative writing, and sophisticated problem-solving.

### Why Upgrade to Plus?
The free version of ChatGPT is excellent, but the Plus subscription unlocks the true potential of the platform. The inclusion of DALL-E 3 for seamless image generation within the chat interface, combined with the ability to browse the live web, makes it an indispensable tool for professionals.

### Real-World Performance
In our extensive testing, ChatGPT Plus consistently outperformed competitors in coding tasks, logical reasoning, and nuanced creative writing. The Advanced Data Analysis feature (formerly Code Interpreter) is a game-changer for anyone working with spreadsheets or datasets.
    `,
    dateAdded: '2026-03-01',
    homeSection: 'popular',
    ctaText: 'Start ChatGPT Plus',
    ctaLink: 'https://chat.openai.com',
    ctaPosition: 'both'
  },
  {
    id: '2',
    slug: 'midjourney-v6',
    name: 'Midjourney v6',
    tagline: 'Breathtaking AI image generation',
    description: 'Midjourney is an independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species through incredible AI image generation.',
    category: 'Image Generation',
    imageUrl: 'https://images.unsplash.com/photo-1686191128892-3b370f3ff558?auto=format&fit=crop&q=80&w=1000',
    pricing: 'Starts at $10/month',
    rating: {
      overall: 4.7,
      easeOfUse: 3.5,
      features: 4.8,
      valueForMoney: 4.6,
      performance: 4.9
    },
    pros: ['Unmatched image quality and aesthetics', 'Highly responsive to prompt nuances', 'Excellent community support', 'Continuous rapid updates'],
    cons: ['Requires Discord to use', 'Steep learning curve for advanced prompting', 'No free tier available'],
    features: ['High-Resolution Upscaling', 'Style Tuning', 'Vary Region (Inpainting)', 'Zoom Out', 'Pan'],
    websiteUrl: 'https://midjourney.com',
    content: `
When it comes to pure aesthetic quality and artistic interpretation, Midjourney stands alone at the top of the AI image generation mountain. Version 6 brings unprecedented photorealism and prompt adherence.

### The Discord Interface
The biggest hurdle for new users is the interface. Midjourney operates entirely within Discord via a bot. While this fosters a vibrant community, it can be intimidating for users accustomed to traditional web apps. However, once mastered, the workflow is surprisingly fast.

### Artistic Prowess
Where Midjourney truly shines is its default aesthetic. Even with simple prompts, it tends to produce visually striking, highly stylized images that look professionally crafted.
    `,
    dateAdded: '2026-03-02',
    homeSection: 'latest',
    ctaText: 'Try Midjourney',
    ctaLink: 'https://midjourney.com',
    ctaPosition: 'bottom'
  },
  {
    id: '3',
    slug: 'notion-ai',
    name: 'Notion AI',
    tagline: 'Your connected workspace, now with AI',
    description: 'Notion AI integrates seamlessly into your existing Notion workspace, helping you write better, think faster, and automate tedious tasks without switching contexts.',
    category: 'Productivity',
    imageUrl: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?auto=format&fit=crop&q=80&w=1000',
    pricing: '$10/month per user',
    rating: {
      overall: 4.5,
      easeOfUse: 4.8,
      features: 4.2,
      valueForMoney: 4.4,
      performance: 4.6
    },
    pros: ["Seamless integration with Notion docs", "Excellent for summarizing long notes", "Helps overcome writer's block", "Action item extraction"],
    cons: ['Requires existing Notion usage to be valuable', 'Not as powerful as standalone LLMs for complex reasoning'],
    features: ['Text Generation', 'Summarization', 'Translation', 'Tone Adjustment', 'Action Item Extraction'],
    websiteUrl: 'https://notion.so/product/ai',
    content: `
Notion AI isn't trying to be a general-purpose chatbot; it's designed specifically to enhance your productivity within the Notion ecosystem. And at that, it excels brilliantly.

### Context is King
The superpower of Notion AI is that it understands the context of the page you are working on. You can highlight a messy meeting transcript and ask it to "extract action items," and it does so flawlessly, formatting them as a checklist right in your document.

### Writing Assistant
As a writing assistant, it's incredibly fluid. Pressing the spacebar on a new line summons the AI, ready to brainstorm ideas, draft an email, or rewrite your paragraph to sound more professional.
    `,
    dateAdded: '2026-03-03',
    homeSection: 'new',
    ctaText: 'Get Notion AI',
    ctaLink: 'https://notion.so/product/ai',
    ctaPosition: 'top'
  }
];

export const initialAdSettings: AdSettings = {
  headerAd: '',
  afterFirstParagraph: '',
  middleArticle: '',
  beforeConclusion: '',
  sidebarAd: '',
  footerAd: ''
};

export const initialSiteSettings: SiteSettings = {
  footerCategories: ['Chatbots', 'Image Generation', 'Productivity', 'Video Editing'],
  categoryGroups: [
    { name: 'Solutions', categories: ['Chatbots', 'Writing'] },
    { name: 'Products', categories: ['Image Generation', 'Video Editing'] },
    { name: 'Resources', categories: ['Productivity', 'Coding'] }
  ],
  newsletterTitle: 'Stay Ahead of the AI Curve',
  newsletterDescription: 'Join 50,000+ subscribers getting the latest AI tool reviews and news delivered weekly.',
  newsletterButtonText: 'Subscribe Now',
  newsletterSuccessMsg: 'Success! Your free Top 10 Prompts PDF has been sent to your email.',
  newsletterAutomationText: 'Thank you for subscribing! Here is your free PDF.',
  newsletterAutomationPdfUrl: '',
  logoText: 'Start AI Guide',
  slogan: 'Your trusted source for AI tool reviews and insights.',
  privacyPolicy: '# Privacy Policy\n\nYour privacy is important to us.',
  termsOfService: '# Terms of Service\n\nThese terms govern your use of our website.',
  aboutUs: '# About Us\n\nWe are a team of AI enthusiasts.',
  contactUs: '# Contact Us\n\nGet in touch with us at contact@startai.com.',
  postsPerSection: 5,
  categories: ['Chatbots', 'Image Generation', 'Productivity', 'Video Editing', 'Writing', 'Coding'],
  headerTitle: 'The Future is Here',
  headerSubtitle: 'Discover the Best AI Tools & Platforms',
  headerDescription: 'We test, review, and compare the latest AI software so you can find exactly what you need to boost your productivity and creativity.',
  headerImageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
  preFooterTitle1: 'Fast & Accurate',
  preFooterDesc1: 'We test tools rigorously to ensure they deliver on their promises of speed and accuracy.',
  preFooterTitle2: 'Unbiased Reviews',
  preFooterDesc2: 'Our reviews are 100% independent. We highlight both the pros and the cons.',
  preFooterTitle3: 'Top Rated Only',
  preFooterDesc3: 'We filter out the noise and only showcase the absolute best AI tools in the market.'
};
