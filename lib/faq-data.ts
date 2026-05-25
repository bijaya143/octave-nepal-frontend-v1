/**
 * Shared FAQ data — used by both the server page (for JSON-LD schema)
 * and the interactive client component (for the accordion UI).
 */

export type FaqItem = {
  question: string;
  answer: string;
  category?: string;
};

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Octave Nepal";

export const faqs: FaqItem[] = [
  {
    question: `What is ${SITE_NAME}?`,
    answer: `${SITE_NAME} is an AI-powered online learning platform in Nepal. We offer practical, project-based and cohort-based courses taught by industry practitioners, combined with live Q&A sessions, collaborative student channels, and a focus on real-world career outcomes.`,
    category: "General",
  },
  {
    question: "Are courses self-paced or live?",
    answer:
      "We use a hybrid learning model: you learn at your own pace with high-quality pre-recorded modules during the week, combined with regular live interactive Q&A sessions, cohort assignments, and structured weekly milestones led by expert instructors.",
    category: "Format",
  },
  {
    question: "How do I enroll in a course?",
    answer:
      "Browse our Courses page, select a course, and click Enroll. We support seamless local payment options including eSewa, Khalti, Fonepay (via QR scan), ConnectIPS, as well as local and international credit/debit cards. Enrollment is instant upon successful payment.",
    category: "Enrollment",
  },
  {
    question: "Do you provide certificates?",
    answer: `Yes. Upon completing all required course modules, assignments, and the capstone project, you will receive a verified digital certificate from ${SITE_NAME} that you can share on LinkedIn or include in your resume for potential employers.`,
    category: "Certification",
  },
  {
    question: "What if I get stuck on a concept or assignment?",
    answer:
      "You are never left alone! Every course has a dedicated community space (on Slack or Discord) where you can collaborate with peers, ask questions, get feedback on your projects, and attend live weekly office hours hosted by our course instructors and teaching assistants.",
    category: "Support",
  },
  {
    question: "Do courses include real-world projects?",
    answer:
      "Absolutely. Our curriculum is entirely project-based. You will build multiple hands-on projects throughout the course, culminating in a capstone project that solves actual business problems, helping you build a professional portfolio that stands out to hiring managers.",
    category: "Curriculum",
  },
  {
    question: "Can I join as a complete beginner?",
    answer:
      "Yes! We offer a wide range of foundational courses made specifically for beginners across various fields, including business, creative arts, technology, and professional skills. Prerequisites (if any) are clearly listed on each individual course page so you know exactly where to start.",
    category: "Learning",
  },
  {
    question: "Do you offer student discounts?",
    answer:
      "We occasionally run promotional discounts and offers. Subscribe to the newsletter on our homepage or follow us on our social media handles to stay updated on upcoming scholarships and special cohort offers.",
    category: "Pricing",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 7-day refund window if the course is not a good fit for you and you have consumed less than 20% of the content. You can submit a refund request through the Contact page with your purchase details.",
    category: "Payments",
  },
  {
    question: "Can I access courses on mobile?",
    answer:
      "Yes. The platform is fully responsive and optimized for modern mobile browsers, allowing you to learn on the go from your phone or tablet.",
    category: "Access",
  },
];
