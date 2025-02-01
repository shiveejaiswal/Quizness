export const mockPlayers = [
  {
    name: "Alex",
    points: 980,
    avatar: "/placeholder.svg",
  },
  {
    name: "Sarah",
    points: 850,
    avatar: "/placeholder.svg",
  },
  {
    name: "Mike",
    points: 720,
    avatar: "/placeholder.svg",
  },
  {
    name: "Emma",
    points: 690,
    avatar: "/placeholder.svg",
  },
  {
    name: "John",
    points: 650,
    avatar: "/placeholder.svg",
  },
]

export const mockQuestions = [
  {
    id: 1,
    description: "What is React's virtual DOM?",
    topic: "React Fundamentals",
    options: [
      {
        id: 1,
        description: "A direct copy of the real DOM",
        is_correct: false,
      },
      {
        id: 2,
        description: "A lightweight copy of the real DOM used for performance optimization",
        is_correct: true,
      },
      {
        id: 3,
        description: "A browser feature for rendering web pages",
        is_correct: false,
      },
      {
        id: 4,
        description: "A third-party library for DOM manipulation",
        is_correct: false,
      },
    ],
  },
  {
    id: 2,
    description: "Which hook is used for side effects in React?",
    topic: "React Hooks",
    options: [
      {
        id: 5,
        description: "useState",
        is_correct: false,
      },
      {
        id: 6,
        description: "useReducer",
        is_correct: false,
      },
      {
        id: 7,
        description: "useEffect",
        is_correct: true,
      },
      {
        id: 8,
        description: "useContext",
        is_correct: false,
      },
    ],
  },
  {
    id: 3,
    description: "What is the purpose of keys in React lists?",
    topic: "React Lists",
    options: [
      {
        id: 9,
        description: "To style list items",
        is_correct: false,
      },
      {
        id: 10,
        description: "To help React identify which items have changed",
        is_correct: true,
      },
      {
        id: 11,
        description: "To create unique CSS selectors",
        is_correct: false,
      },
      {
        id: 12,
        description: "To sort list items",
        is_correct: false,
      },
    ],
  },
]

