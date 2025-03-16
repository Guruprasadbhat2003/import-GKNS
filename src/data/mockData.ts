import { Question } from '../types';

export const examRules = [
  "Do not switch tabs or windows during the exam",
  "Maintain full-screen mode throughout the exam",
  "Do not use any external resources",
  "Three warnings will result in automatic submission",
  "Complete all questions within the allocated time",
];

export const mockQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1
  },
  {
    id:4,
    question: "What does AI stand for?",
    options: ["Artificial Intelligence", "Automated Integration", "Advanced Internet", "Algorithmic Input"],
    correctAnswer: 0
  },
  {
    id: 5,
    question: "Which of the following is a programming language used in AI development?",
    options: ["Python", "HTML", "CSS", "XML"],
    correctAnswer: 0
  },
  {
    id: 6,
    question: "What is the full form of CPU?",
    options: ["Central Processing Unit", "Central Program Unit", "Central Power Unit", "Central Peripheral Unit"],
    correctAnswer: 0
  },
  {
    id: 7,
    question: "Which of these is an example of an AI assistant?",
    options: ["Alexa", "Photoshop", "Notepad", "Chrome"],
    correctAnswer: 0
  },
  {
    id: 8,
    question: "Which company developed the AI model ChatGPT?",
    options: ["Google", "OpenAI", "Microsoft", "Amazon"],
    correctAnswer: 1
  }
];