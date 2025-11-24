export interface Course {
  id: string;
  name: string;
  category: string;
  difficultyLevel: number;
  careerPath: string;
  prerequisites: string;
  credits: number;
  description: string;
}

export interface Student {
  id: string;
  name: string;
  branch: string;
  semester: number;
  cgpa: number;
  mathScore: number;
  codingSkill: number;
  timeCommitment: string;
  interestAreas: string[];
  careerGoal: string;
}

export const courses: Course[] = [
  {
    id: "CS401",
    name: "Data Mining and Warehousing",
    category: "Data Science",
    difficultyLevel: 3,
    careerPath: "Data Scientist",
    prerequisites: "Database Systems",
    credits: 4,
    description: "Learn techniques for extracting patterns from large datasets and building data warehouses.",
  },
  {
    id: "CS402",
    name: "Deep Learning",
    category: "AI/ML",
    difficultyLevel: 5,
    careerPath: "ML Engineer",
    prerequisites: "Machine Learning, Linear Algebra",
    credits: 4,
    description: "Advanced neural network architectures including CNNs, RNNs, and transformers.",
  },
  {
    id: "CS403",
    name: "Web Security",
    category: "Cybersecurity",
    difficultyLevel: 3,
    careerPath: "Cybersecurity Engineer",
    prerequisites: "Computer Networks",
    credits: 3,
    description: "Understanding web vulnerabilities, encryption, and security best practices.",
  },
  {
    id: "CS404",
    name: "Cloud Computing",
    category: "Cloud",
    difficultyLevel: 2,
    careerPath: "Cloud Engineer",
    prerequisites: "Operating Systems",
    credits: 3,
    description: "Introduction to cloud platforms like AWS, Azure, and Google Cloud.",
  },
  {
    id: "CS405",
    name: "Advanced Algorithms",
    category: "Core CS",
    difficultyLevel: 4,
    careerPath: "Backend Developer",
    prerequisites: "Data Structures and Algorithms",
    credits: 4,
    description: "Advanced algorithmic techniques including dynamic programming and graph algorithms.",
  },
  {
    id: "CS406",
    name: "Natural Language Processing",
    category: "AI/ML",
    difficultyLevel: 4,
    careerPath: "ML Engineer",
    prerequisites: "Machine Learning",
    credits: 4,
    description: "Processing and understanding human language using computational methods.",
  },
  {
    id: "CS407",
    name: "Full Stack Web Development",
    category: "Web Development",
    difficultyLevel: 2,
    careerPath: "Backend Developer",
    prerequisites: "Basic Programming",
    credits: 3,
    description: "Build complete web applications using modern frameworks and tools.",
  },
  {
    id: "CS408",
    name: "Computer Vision",
    category: "AI/ML",
    difficultyLevel: 5,
    careerPath: "ML Engineer",
    prerequisites: "Deep Learning",
    credits: 4,
    description: "Image processing, object detection, and visual recognition systems.",
  },
  {
    id: "CS409",
    name: "Blockchain Technology",
    category: "Systems",
    difficultyLevel: 3,
    careerPath: "Backend Developer",
    prerequisites: "Data Structures",
    credits: 3,
    description: "Distributed ledger technology, smart contracts, and cryptocurrencies.",
  },
  {
    id: "CS410",
    name: "Financial Analytics",
    category: "Finance/Analytics",
    difficultyLevel: 2,
    careerPath: "Product/Business",
    prerequisites: "Statistics",
    credits: 3,
    description: "Data analysis techniques for financial modeling and business intelligence.",
  },
  {
    id: "CS411",
    name: "Ethical Hacking",
    category: "Cybersecurity",
    difficultyLevel: 4,
    careerPath: "Cybersecurity Engineer",
    prerequisites: "Computer Networks",
    credits: 3,
    description: "Penetration testing, vulnerability assessment, and security auditing.",
  },
  {
    id: "CS412",
    name: "DevOps and CI/CD",
    category: "Cloud",
    difficultyLevel: 2,
    careerPath: "Cloud Engineer",
    prerequisites: "Software Engineering",
    credits: 3,
    description: "Continuous integration, deployment pipelines, and infrastructure as code.",
  },
  {
    id: "CS413",
    name: "Research Methodology",
    category: "Core CS",
    difficultyLevel: 2,
    careerPath: "Researcher",
    prerequisites: "None",
    credits: 2,
    description: "Fundamentals of academic research, paper writing, and experimentation.",
  },
  {
    id: "CS414",
    name: "Advanced Machine Learning",
    category: "AI/ML",
    difficultyLevel: 5,
    careerPath: "Researcher",
    prerequisites: "Machine Learning",
    credits: 4,
    description: "Cutting-edge ML techniques including reinforcement learning and generative models.",
  },
  {
    id: "CS415",
    name: "Mobile App Development",
    category: "Web Development",
    difficultyLevel: 3,
    careerPath: "Backend Developer",
    prerequisites: "Basic Programming",
    credits: 3,
    description: "Build native and cross-platform mobile applications.",
  },
];

export const students: Student[] = [
  {
    id: "ST001",
    name: "Arjun Sharma",
    branch: "CSE-AIML",
    semester: 6,
    cgpa: 8.5,
    mathScore: 85,
    codingSkill: 80,
    timeCommitment: "High",
    interestAreas: ["AI/ML", "Data Science"],
    careerGoal: "Data Scientist",
  },
  {
    id: "ST002",
    name: "Priya Patel",
    branch: "CSE",
    semester: 5,
    cgpa: 9.2,
    mathScore: 95,
    codingSkill: 90,
    timeCommitment: "High",
    interestAreas: ["AI/ML", "Web Development"],
    careerGoal: "ML Engineer",
  },
  {
    id: "ST003",
    name: "Rahul Verma",
    branch: "IT",
    semester: 7,
    cgpa: 7.8,
    mathScore: 70,
    codingSkill: 75,
    timeCommitment: "Medium",
    interestAreas: ["Web Development", "Cloud"],
    careerGoal: "Backend Developer",
  },
  {
    id: "ST004",
    name: "Sneha Reddy",
    branch: "ECE",
    semester: 6,
    cgpa: 8.0,
    mathScore: 80,
    codingSkill: 65,
    timeCommitment: "Medium",
    interestAreas: ["Cybersecurity", "Systems"],
    careerGoal: "Cybersecurity Engineer",
  },
  {
    id: "ST005",
    name: "Vikram Singh",
    branch: "CSE-AIML",
    semester: 8,
    cgpa: 9.5,
    mathScore: 98,
    codingSkill: 95,
    timeCommitment: "High",
    interestAreas: ["AI/ML"],
    careerGoal: "Researcher",
  },
];

export const branches = ["CSE", "CSE-AIML", "IT", "ECE", "EEE", "Mechanical"];
export const semesters = [3, 4, 5, 6, 7, 8];
export const timeCommitments = ["Low", "Medium", "High"];
export const interestAreas = [
  "AI/ML",
  "Data Science",
  "Web Development",
  "Cybersecurity",
  "Cloud",
  "Finance/Analytics",
  "Systems",
  "Core CS",
];
export const careerGoals = [
  "Data Scientist",
  "ML Engineer",
  "Backend Developer",
  "Cybersecurity Engineer",
  "Cloud Engineer",
  "Researcher",
  "Product/Business",
];
export const categories = [
  "AI/ML",
  "Data Science",
  "Web Development",
  "Cybersecurity",
  "Cloud",
  "Finance/Analytics",
  "Systems",
  "Core CS",
];
