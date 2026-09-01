export type BlogSection = {
  title: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAttributionLabel: string;
  imageAttributionHref: string;
  publishedBy: string;
  role: string;
  summary: string;
  sections: BlogSection[];
};

export const BLOG_PUBLISHER = 'Shiloh';
export const BLOG_ROLE = 'Dunamis Shiloh Company Brand Strategist · Global Speaker · Founder, BrandPawa';

export const blogPosts: BlogPost[] = [
  {
    slug: '20-brand-prophecies-for-2026',
    title: '20 Brand Prophecies for 2026',
    excerpt: 'Twenty shifts shaping the brands that will win trust, attention, and commercial power in 2026.',
    image: 'https://images.pexels.com/photos/7821908/pexels-photo-7821908.jpeg?cs=srgb&dl=pexels-rdne-7821908.jpg&fm=jpg',
    imageAttributionLabel: 'Pexels: RDNE Stock project',
    imageAttributionHref: 'https://www.pexels.com/photo/woman-in-white-long-sleeve-shirt-sitting-beside-man-in-brown-long-sleeve-shirt-7821908/',
    publishedBy: BLOG_PUBLISHER,
    role: BLOG_ROLE,
    summary: 'These prophecies are already in motion. The only question is whether your brand is positioned to benefit from them or be buried by them.',
    sections: [
      {
        title: 'Opening',
        paragraphs: [
          'The market is shifting. The rules are being rewritten. And the brands that see it coming will be the ones left standing when the dust settles.',
          'These are not trends. They are not predictions. They are prophecies: patterns already forming beneath the surface that will fully break through in 2026. Read them carefully. Some will affirm what you are already doing. Others will challenge everything you think is working.',
          'Either way, what you do with them is your choice.'
        ]
      },
      {
        title: 'The Prophecies',
        paragraphs: [
          '1. 2026 will reward brands with a face, not faceless businesses. People will only buy from people they can see, hear, and trust. If there is no human being attached to your brand, there is no reason for anyone to choose you over the next option.',
          '2. Personal brands will outperform corporate brands in influence and sales. The human voice will convert faster than the corporate one. Positioning will become your most valuable asset.',
          '3. Short-form storytelling will become the number one growth engine. Not content, story. Not noise, narrative. One story, told well, will beat ten careless updates.',
          '4. Brands that do not show receipts will go extinct. Testimonials, results, and case studies will be the new currency of trust.',
          '5. AI will not replace creators, but it will replace the lazy ones. Those who use it to amplify original thinking will outpace those who use it to skip thinking.',
          '6. Communities will become more valuable than followership. Ten thousand followers will mean little compared with three hundred loyal people who feel they belong.',
          '7. Influence will shift from entertainers to educators and solution-givers. People want sense, not just vibes.',
          '8. Your online reputation will matter more than your CV. What people find when they search your name will shape decisions before you speak.',
          '9. Video presence will no longer be optional. If you do not show your face in 2026, your audience will assume you do not exist.',
          '10. Brands that master clarity will dominate noisy ones. Clarity is a competitive weapon.',
          '11. Collaborations will become the new accelerator. One strategic partnership can do what months of solo marketing cannot.',
          '12. The era of posting just to post will die. Intentional, value-driven content will outperform random activity.',
          '13. A new wave of digital entrepreneurs will rise from Africa. The world will increasingly look to Africa for creativity, innovation, and brand culture.',
          '14. Reputation management will matter more than follower growth. One bad moment can undo a year of work.',
          '15. Your brand tone will influence your income. Confidence, authority, and authenticity will sell more than discounts.',
          '16. People will buy experiences, not products. Your brand energy and how people feel around your brand will drive conversion.',
          '17. You will need a signature system or framework to stand out. The branded, named, repeatable approach will win.',
          '18. Those who show their journey will grow faster than those who hide it. Transparency will become a strategy.',
          '19. Niche domination will beat general influence. Specialists will earn more than generalists because they are remembered faster.',
          '20. 2026 will favour builders, not complainers. The people who create, teach, serve, and move will compound faster than everyone waiting for perfect conditions.'
        ]
      },
      {
        title: 'Final Word',
        paragraphs: [
          'These prophecies are already in motion. The only question is whether your brand is positioned to benefit from them or be buried by them.',
          'If you do not know where your brand stands today, you cannot navigate what is coming tomorrow.',
          'That is exactly what BrandPawa was built for: diagnosis before prescription, clarity before execution, and systems that make sure your hard work actually produces results.',
          'The market is moving. Move with it.'
        ]
      }
    ]
  },
  {
    slug: '5-ways-branding-directly-drives-revenue-growth',
    title: '5 Ways Branding Directly Drives Revenue Growth',
    excerpt: 'A clear brand is not decoration. It is a revenue system that pulls buyers in, protects pricing, and shortens your sales cycle.',
    image: 'https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg?cs=srgb&dl=pexels-startup-stock-photos-7097.jpg&fm=jpg',
    imageAttributionLabel: 'Pexels: Startup Stock Photos',
    imageAttributionHref: 'https://www.pexels.com/photo/people-coffee-meeting-team-7097/',
    publishedBy: BLOG_PUBLISHER,
    role: BLOG_ROLE,
    summary: 'Every one of these revenue drivers comes back to the same thing: clarity, consistency, and credibility.',
    sections: [
      {
        title: 'Opening',
        paragraphs: [
          'Most entrepreneurs treat branding as a design project. They commission a logo, pick some colours, and move on, convinced they have handled it.',
          'The truth is that branding is not decoration. It is a commercial system. And when it is built correctly, it does not just make you look good. It makes you money.'
        ]
      },
      {
        title: 'The Five Revenue Drivers',
        paragraphs: [
          '1. It makes people choose you before they compare prices. Clear, consistent, credible brands create brand pull. People arrive already leaning toward yes.',
          '2. It allows you to charge premium prices and have people pay them. Price resistance is often a perception problem, and perception is exactly what branding shapes.',
          '3. It turns customers into repeat buyers and referral sources. A brand with voice, values, and consistent experience builds relationships, and relationships compound revenue.',
          '4. It attracts better opportunities. Strong brands do not just attract customers. They attract premium clients, collaborators, media attention, speaking invitations, and strategic deals.',
          '5. It shortens your sales cycle. A strong brand reduces the trust gap between discovery and purchase, so warmer prospects arrive and close faster.'
        ]
      },
      {
        title: 'The Pattern Behind All Five',
        paragraphs: [
          'Every one of these revenue drivers comes back to the same thing: clarity, consistency, and credibility. A brand that people understand, recognise, and trust will always outperform one that is merely active.',
          'This is why one of the best investments a business can make is not automatically more content, more ads, or more offers. It is understanding where the brand stands now, what is leaking value, and what to fix first.',
          'Once that clarity exists, everything else becomes faster, cheaper, and more effective.'
        ]
      }
    ]
  },
  {
    slug: 'why-most-african-businesses-are-invisible',
    title: 'Why Most African Businesses Are Invisible (And It Is Not About Money)',
    excerpt: 'Many African businesses are not invisible because they lack funds. They are invisible because the brand is unclear.',
    image: 'https://images.pexels.com/photos/6913217/pexels-photo-6913217.jpeg?cs=srgb&dl=pexels-tima-miroshnichenko-6913217.jpg&fm=jpg',
    imageAttributionLabel: 'Pexels: Tima Miroshnichenko',
    imageAttributionHref: 'https://www.pexels.com/photo/people-having-a-business-meeting-6913217/',
    publishedBy: BLOG_PUBLISHER,
    role: BLOG_ROLE,
    summary: 'The businesses that will rise from Africa and compete globally are the ones that build with precision, not just energy.',
    sections: [
      {
        title: 'Opening',
        paragraphs: [
          'There is a conversation happening quietly in boardrooms, WhatsApp groups, and late-night reflection sessions across Africa: I am working harder than ever, so why is nobody finding me?',
          'If you have had that conversation with yourself, the answer is almost never what people assume it is.'
        ]
      },
      {
        title: 'The Assumption That Keeps Businesses Stuck',
        paragraphs: [
          'When African entrepreneurs struggle with visibility, the instinct is to blame resources. Not enough money for ads. No access. No connections.',
          'Structural challenges are real, but they are not the primary reason most businesses remain invisible.',
          'Most businesses are invisible because they are unclear. Not underfunded. Not unlucky. Unclear.'
        ]
      },
      {
        title: 'What Invisibility Actually Looks Like',
        paragraphs: [
          'Invisibility can look like attention that never converts, content that creates no momentum, customers who do not refer others, and constant price resistance despite strong quality.',
          'These are not just marketing failures. They are brand failures rooted in a lack of clarity.'
        ]
      },
      {
        title: 'The Three Clarity Gaps',
        paragraphs: [
          'Gap 1: Positioning clarity. If your message tries to speak to everyone, it will resonate deeply with no one.',
          'Gap 2: Messaging clarity. If people cannot immediately understand what you do and why it matters, confusion will cost you sales daily.',
          'Gap 3: Consistency clarity. If your brand changes from platform to platform or day to day, recognition never compounds.'
        ]
      },
      {
        title: 'The Good News',
        paragraphs: [
          'Clarity gaps are fixable. They do not require a huge budget. They require honest diagnosis and strategic intention.',
          'The businesses that will rise from Africa and compete on the global stage are not necessarily the ones with the most resources. They are the ones that know exactly who they are, who they serve, and how to communicate it in a way that earns trust.'
        ]
      }
    ]
  },
  {
    slug: 'the-difference-between-a-brand-that-gets-ignored-and-one-that-gets-paid',
    title: 'The Difference Between a Brand That Gets Ignored and One That Gets Paid',
    excerpt: 'The gap between chasing clients and commanding premium fees is usually not talent. It is brand authority.',
    image: 'https://images.pexels.com/photos/11381964/pexels-photo-11381964.jpeg?auto=compress&cs=tinysrgb&w=1200',
    imageAttributionLabel: 'Pexels: Chidimma Peace',
    imageAttributionHref: 'https://www.pexels.com/photo/portrait-of-pensive-businesswoman-11381964/',
    publishedBy: BLOG_PUBLISHER,
    role: BLOG_ROLE,
    summary: 'The brands that get paid are not necessarily better. They are clearer, more consistent, and more intentional about how they communicate value.',
    sections: [
      {
        title: 'Opening',
        paragraphs: [
          'Two businesses can have similar skill, similar city, and similar experience, yet one stays discounted while the other commands premium fees.',
          'The difference is usually not talent or luck. It is brand authority.'
        ]
      },
      {
        title: 'What Authority Actually Means',
        paragraphs: [
          'Authority is not fame and it is not a long CV. It is the position you occupy in the mind of your market as someone who clearly knows what they are talking about and can be trusted without excessive verification.',
          'When you have authority, the sale starts before the conversation. When you do not, every interaction begins with proof from scratch.'
        ]
      },
      {
        title: 'The Signals That Build Authority',
        paragraphs: [
          'Signal 1: Clarity of positioning. Strong brands know who they are for and what they do best.',
          'Signal 2: Visible proof. Case studies, testimonials, and documented results are not optional if you want trust.',
          'Signal 3: Consistent presence. Trust is built on predictable quality and repeated signal.',
          'Signal 4: Communication that commands. Tone is not just a style choice. It is a commercial asset or liability.'
        ]
      },
      {
        title: 'Why Good Work Is Not Enough',
        paragraphs: [
          'Quality alone does not create authority. Excellence that is invisible is commercially worthless.',
          'The goal is not to choose between excellence and brand. The goal is to build both: work that delivers and a brand that makes the market notice.'
        ]
      },
      {
        title: 'The Gap Between Ignored and Paid',
        paragraphs: [
          'If your work is strong but your fees do not reflect it, the first step is honest diagnosis.',
          'The brands that get paid are not necessarily better. They are clearer, more consistent, and more intentional about how they communicate their value. That gap is closeable, but it starts with knowing exactly where you stand.'
        ]
      }
    ]
  },
  {
    slug: 'you-do-not-have-a-marketing-problem-you-have-a-brand-problem',
    title: "You Don't Have a Marketing Problem. You Have a Brand Problem.",
    excerpt: 'Marketing amplifies whatever already exists. If the brand is weak, marketing only scales the confusion.',
    image: 'https://images.pexels.com/photos/29065467/pexels-photo-29065467.jpeg?cs=srgb&dl=pexels-leticiacurveloph-29065467.jpg&fm=jpg',
    imageAttributionLabel: 'Pexels: Letícia Curvelo',
    imageAttributionHref: 'https://www.pexels.com/photo/a-woman-working-with-a-laptop-29065467/',
    publishedBy: BLOG_PUBLISHER,
    role: BLOG_ROLE,
    summary: 'Fix the brand first. Then market with everything you have.',
    sections: [
      {
        title: 'Opening',
        paragraphs: [
          'The most common diagnosis entrepreneurs make when growth stalls is that they need more marketing: more posts, more ads, more content, more visibility.',
          'Sometimes that creates a short spike. Often it creates activity without results because the diagnosis was wrong. The problem was never the marketing.'
        ]
      },
      {
        title: 'What Marketing Cannot Fix',
        paragraphs: [
          'Marketing is distribution. It amplifies a message and puts it in front of more people.',
          'If the underlying brand is unclear, inconsistent, or unconvincing, marketing does not fix it. It scales it. More traffic through a leaking pipe does not fill the tank.'
        ]
      },
      {
        title: 'How to Tell If You Have a Brand Problem',
        paragraphs: [
          'If people cannot explain what you do in one sentence, your messaging is unclear.',
          'If you get attention that does not convert, people are curious but not convinced.',
          'If you constantly compete on price, your perceived value is not strong enough yet.',
          'If your presence is inconsistent across platforms, the market cannot build a reliable picture of who you are.',
          'If you cannot articulate why someone should choose you, neither can your buyers.'
        ]
      },
      {
        title: 'The Real Sequence',
        paragraphs: [
          'Most people start with marketing before they establish the brand foundations that make marketing effective.',
          'The correct sequence is diagnose first, build the foundation second, then market. Once positioning, audience clarity, messaging, and identity are solid, content lands better, ads convert better, and referrals happen more naturally.'
        ]
      },
      {
        title: 'Where to Start',
        paragraphs: [
          'This is not an argument against marketing. Visibility matters deeply.',
          'But visibility without conversion is vanity, and conversion without retention is churn. The entire chain is held together by brand.',
          'Fix the brand first. Then market with everything you have. The results will feel different because they will be built on something that actually holds.'
        ]
      }
    ]
  }
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
