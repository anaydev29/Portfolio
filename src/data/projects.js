// Edit this file to change what shows on the Projects page.
// `live` and `github` are optional: a button only appears when you fill the link in.
// Links, descriptions and tech stacks were taken from the READMEs on github.com/anaydev29.

export const projects = [
  {
    id: 'devintel',
    featured: true,
    title: 'DevIntel',
    type: 'Full Stack · Tech Analytics',
    description:
      'A developer intelligence platform that collects public data from GitHub, Stack Overflow, Hacker News and dev.to every day and scores 87 technologies. It has rankings, a skill-gap finder, side-by-side comparisons and trending repos. My main session project.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'Tailwind CSS', 'GitHub Actions'],
    github: 'https://github.com/anaydev29/DevIntel',
    live: '', // README says the live demo is "coming soon": add the link here when it is up
  },
  {
    id: 'crop-insurance-dapp',
    title: 'AI-Powered Crop Insurance DApp',
    type: 'Blockchain + AI',
    description:
      'Farmers upload crop photos, Gemini AI diagnoses the damage, and the claim is recorded on Ethereum. Insurers approve it and a smart contract releases the payout. Reports are stored on IPFS.',
    stack: ['Solidity', 'Hardhat', 'React', 'Ethers.js', 'Gemini AI', 'IPFS'],
    github: 'https://github.com/anaydev29/crop-insurance-dapp',
    live: 'https://crop-insurance-dapp.vercel.app',
  },
  {
    id: 'trustvault',
    title: 'TrustVault',
    type: 'Security · Blockchain',
    description:
      'A zero-trust identity and access platform using W3C decentralized identifiers, verifiable credentials, a risk-scoring policy engine and a tamper-evident audit ledger.',
    stack: ['NestJS', 'React', 'TypeScript', 'PostgreSQL', 'Prisma'],
    github: 'https://github.com/anaydev29/TrustVault',
    live: '',
  },
  {
    id: 'absolute-cinema',
    title: 'Absolute Cinema',
    type: 'Full Stack Web App',
    description:
      'A movie review platform: search movies and series through the OMDB API, write reviews and star ratings, keep a watchlist, and manage everything from an admin panel.',
    stack: ['Node.js', 'Express', 'MongoDB', 'JWT', 'OMDB API'],
    github: 'https://github.com/anaydev29/movie-review-system',
    live: '', // the old Railway demo link expired: add a new one here when it is redeployed
  },
  {
    id: 'campus-marketplace',
    title: 'Campus Marketplace',
    type: 'Full Stack MERN',
    description:
      'A marketplace where students buy, sell and exchange items on campus. JWT login, role-based admin dashboard, wishlist, image uploads and light/dark theming.',
    stack: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    github: 'https://github.com/anaydev29/campus-marketplace',
    live: '',
  },
  {
    id: 'ravindra-ias',
    title: 'Ravindra IAS Website',
    type: 'Frontend Hackathon',
    description:
      'A premium, animation-rich 6-page site for a coaching institute, with custom scroll-reveal, parallax and typewriter hooks, glassmorphism UI and auto-looping sliders.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'React Router'],
    github: 'https://github.com/anaydev29/frontend-battle-',
    live: 'https://frontend-battle-green.vercel.app/',
  },
  {
    id: 'brightpath',
    title: 'BrightPath',
    type: 'Wellness PWA',
    description:
      'A gamified wellness companion for students: mood tracking, journaling, habits, achievement badges, voice-guided meditation and AI support, working offline as a PWA.',
    stack: ['JavaScript', 'Node.js', 'MongoDB', 'PWA'],
    // TODO: I could not find this repo on your GitHub: add its links here
    github: '',
    live: '',
  },
]
