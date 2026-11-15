// Edit this file to change what shows on the Projects page.
// `live` and `github` are optional: a button only appears when you fill the link in.
// TODO: add the real live/GitHub links for each project.

export const projects = [
  {
    id: 'devintel',
    featured: true,
    title: 'DevIntel',
    type: 'Full Stack · Tech Analytics',
    // TODO: rewrite this in your own words and fill in the real tech stack
    description:
      'A tech trend analysis platform that helps you see which technologies and tools are gaining momentum. My main session project, still being polished.',
    stack: [],
    github: 'https://github.com/anaydev29/DevIntel',
    live: '',
  },
  {
    id: 'crop-insurance-dapp',
    title: 'AI-Powered Crop Insurance DApp',
    type: 'Blockchain + AI',
    description:
      'Decentralized crop insurance on Ethereum. Gemini vision AI checks uploaded crop-damage photos to verify claims, and perceptual hashing plus EXIF checks block duplicate or fake images.',
    stack: ['Solidity', 'Hardhat', 'React', 'Ethers.js', 'Gemini AI', 'IPFS'],
    github: '',
    live: '',
  },
  {
    id: 'campus-marketplace',
    title: 'Campus Marketplace',
    type: 'Full Stack MERN',
    description:
      'A marketplace where students buy, sell and exchange items on campus. JWT login, role-based admin dashboard, wishlist, image uploads and light/dark theming.',
    stack: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    github: '',
    live: '',
  },
  {
    id: 'brightpath',
    title: 'BrightPath',
    type: 'Wellness PWA',
    description:
      'A gamified wellness companion for students: mood tracking, journaling, habits, achievement badges, voice-guided meditation and AI support, working offline as a PWA.',
    stack: ['JavaScript', 'Node.js', 'MongoDB', 'PWA'],
    github: '',
    live: '',
  },
  {
    id: 'ravindra-ias',
    title: 'Ravindra IAS Website',
    type: 'Frontend Hackathon',
    description:
      'A premium, animation-rich 6-page site for a coaching institute, with custom scroll-reveal, parallax and typewriter hooks, glassmorphism UI and auto-looping sliders.',
    stack: ['React', 'Tailwind CSS', 'React Router', 'Vercel'],
    github: '',
    live: '',
  },
]
