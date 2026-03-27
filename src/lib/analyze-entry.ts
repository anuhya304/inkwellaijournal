// Simple text-analysis engine that derives mood, insights, and tasks from user input

const MOOD_KEYWORDS: Record<string, { words: string[]; label: string; score: number }> = {
  joy: { words: ["happy", "excited", "great", "wonderful", "amazing", "love", "grateful", "thankful", "blessed", "fantastic", "awesome", "delighted", "cheerful", "proud"], label: "Joyful", score: 90 },
  calm: { words: ["peaceful", "calm", "relaxed", "serene", "content", "quiet", "steady", "balanced", "mindful", "centered"], label: "Calm", score: 75 },
  motivated: { words: ["motivated", "driven", "ambitious", "focused", "determined", "productive", "energized", "inspired", "goal", "accomplish"], label: "Motivated", score: 80 },
  anxious: { words: ["anxious", "worried", "nervous", "stressed", "overwhelmed", "panic", "afraid", "uncertain", "uneasy", "tense"], label: "Anxious", score: 35 },
  sad: { words: ["sad", "down", "depressed", "lonely", "tired", "exhausted", "drained", "disappointed", "lost", "empty", "miss"], label: "Melancholic", score: 25 },
  frustrated: { words: ["frustrated", "angry", "annoyed", "irritated", "stuck", "blocked", "failing", "struggling", "difficult", "hard"], label: "Frustrated", score: 30 },
  reflective: { words: ["thinking", "wondering", "reflecting", "remember", "realize", "understand", "learn", "notice", "observe", "consider"], label: "Reflective", score: 60 },
  hopeful: { words: ["hope", "looking forward", "optimistic", "better", "improve", "soon", "plan", "future", "dream", "wish"], label: "Hopeful", score: 70 },
};

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
}

function detectMoodScores(text: string): { label: string; score: number }[] {
  const words = tokenize(text);
  const hits: Record<string, number> = {};

  for (const [key, config] of Object.entries(MOOD_KEYWORDS)) {
    const count = words.filter((w) => config.words.some((kw) => w.includes(kw))).length;
    if (count > 0) hits[key] = count;
  }

  if (Object.keys(hits).length === 0) {
    return [{ label: "Neutral", score: 50 }];
  }

  const sorted = Object.entries(hits).sort((a, b) => b[1] - a[1]);
  const topKey = sorted[0][0];
  const config = MOOD_KEYWORDS[topKey];

  return [{ label: config.label, score: config.score }];
}

function generateMoodText(text: string): { moodText: string; moodScore: number; moodLabel: string } {
  const results = detectMoodScores(text);
  const primary = results[0];

  const sentenceCount = text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const lengthNote = sentenceCount > 5 ? "Your writing is detailed and expressive" : "Your entry is concise and focused";

  const moodDescriptions: Record<string, string> = {
    Joyful: `${lengthNote}. There's a bright, positive energy running through your words — you seem genuinely uplifted and present in the moment.`,
    Calm: `${lengthNote}. Your tone is steady and grounded, suggesting inner peace and a composed state of mind.`,
    Motivated: `${lengthNote}. There's a strong sense of drive and purpose here — you're clearly channeling energy toward your goals.`,
    Anxious: `${lengthNote}. There are signs of unease and tension in your writing — something is weighing on your mind.`,
    Melancholic: `${lengthNote}. A quiet heaviness comes through in your words, suggesting you're processing difficult emotions.`,
    Frustrated: `${lengthNote}. There's friction in your writing — you seem to be wrestling with obstacles or setbacks.`,
    Reflective: `${lengthNote}. You're in a contemplative space, turning things over in your mind with curiosity and awareness.`,
    Hopeful: `${lengthNote}. Despite any challenges, there's an optimistic thread — you're looking ahead with possibility.`,
    Neutral: `${lengthNote}. Your tone is measured and even — neither strongly positive nor negative, just present.`,
  };

  return {
    moodText: moodDescriptions[primary.label] || moodDescriptions["Neutral"],
    moodScore: primary.score,
    moodLabel: primary.label,
  };
}

function generateInsights(text: string): string {
  const words = tokenize(text);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim());

  const themes: string[] = [];
  const themeMap: Record<string, string[]> = {
    work: ["work", "job", "meeting", "project", "deadline", "boss", "team", "office", "task", "client"],
    relationships: ["friend", "family", "partner", "relationship", "talk", "conversation", "love", "together", "connect"],
    health: ["exercise", "sleep", "tired", "energy", "walk", "run", "gym", "health", "eat", "body", "rest"],
    growth: ["learn", "read", "book", "course", "skill", "improve", "grow", "practice", "habit", "goal"],
    creativity: ["create", "write", "draw", "music", "art", "design", "idea", "imagine", "build", "craft"],
  };

  for (const [theme, keywords] of Object.entries(themeMap)) {
    if (words.some((w) => keywords.some((k) => w.includes(k)))) {
      themes.push(theme);
    }
  }

  if (themes.length === 0) {
    return `You've written ${sentences.length} thoughts today. Your entry touches on personal reflection — consider what underlying need or desire is surfacing in your writing.`;
  }

  const themeLabels: Record<string, string> = {
    work: "professional life",
    relationships: "connections with others",
    health: "physical well-being",
    growth: "personal development",
    creativity: "creative expression",
  };

  const themeStr = themes.map((t) => themeLabels[t]).join(" and ");
  return `Your writing today centers around ${themeStr}. Across ${sentences.length} thoughts, you're processing how these areas intersect in your life. Pay attention to what energizes you versus what drains you in these reflections.`;
}

function generateTasks(text: string): string[] {
  const words = tokenize(text);
  const tasks: string[] = [];

  const taskTriggers: Record<string, string[]> = {
    "Block 30 minutes for your most important task before checking messages": ["work", "project", "deadline", "busy", "meeting", "task", "overwhelm"],
    "Take a 15-minute walk to clear your head and reset": ["stressed", "tired", "exhausted", "overwhelm", "anxious", "tense", "stuck"],
    "Reach out to someone you mentioned — send that text or make that call": ["friend", "family", "partner", "miss", "talk", "connect", "relationship"],
    "Write down your top 3 priorities for tomorrow before bed": ["plan", "goal", "focus", "productive", "organize", "prepare", "tomorrow"],
    "Spend 20 minutes on something purely creative with no expectations": ["create", "idea", "inspire", "art", "write", "build", "imagine", "dream"],
    "Do a 10-minute body scan or stretching session": ["body", "health", "exercise", "sleep", "rest", "energy", "tired", "physical"],
    "Journal for 5 more minutes about what you're grateful for": ["grateful", "thankful", "blessed", "appreciate", "happy", "good"],
    "Set one clear boundary today — say no to one thing that drains you": ["overwhelm", "busy", "too much", "exhaust", "drain", "boundary", "difficult"],
    "Read or listen to something inspiring for 15 minutes": ["learn", "read", "book", "grow", "skill", "improve", "course"],
    "Prepare your workspace and eliminate one distraction": ["focus", "distract", "productive", "procrastinat", "concentrate"],
  };

  for (const [task, triggers] of Object.entries(taskTriggers)) {
    if (words.some((w) => triggers.some((t) => w.includes(t)))) {
      tasks.push(task);
    }
    if (tasks.length >= 5) break;
  }

  const fallbacks = [
    "Review today's entry tomorrow morning with fresh eyes",
    "Identify one thing you can simplify or let go of",
    "End the day with 3 deep breaths and a moment of stillness",
  ];

  while (tasks.length < 3) {
    const fb = fallbacks[tasks.length];
    if (fb && !tasks.includes(fb)) tasks.push(fb);
    else break;
  }

  return tasks;
}

export function analyzeEntry(text: string) {
  const { moodText, moodScore, moodLabel } = generateMoodText(text);
  const insights = generateInsights(text);
  const tasks = generateTasks(text);

  return { moodText, moodScore, moodLabel, insights, tasks };
}

export function generateQuestion(text: string): string {
  const words = tokenize(text);

  const contextualQuestions: { triggers: string[]; questions: string[] }[] = [
    { triggers: ["work", "job", "project"], questions: ["What would make tomorrow's work feel meaningful?", "What part of your work energizes you most?"] },
    { triggers: ["friend", "family", "love"], questions: ["What do you most want to say to them?", "How have they shaped who you are today?"] },
    { triggers: ["stress", "anxious", "worried"], questions: ["What is within your control right now?", "What would you tell a friend feeling this way?"] },
    { triggers: ["happy", "grateful", "excited"], questions: ["How can you create more moments like this?", "What made this possible?"] },
    { triggers: ["tired", "exhaust", "drain"], questions: ["What would truly recharge you right now?", "What can you remove from your plate?"] },
    { triggers: ["goal", "plan", "future"], questions: ["What's the smallest step you can take today?", "What would success look like in one month?"] },
    { triggers: ["learn", "read", "grow"], questions: ["What surprised you most about what you learned?", "How will you apply this insight?"] },
  ];

  for (const { triggers, questions } of contextualQuestions) {
    if (words.some((w) => triggers.some((t) => w.includes(t)))) {
      return questions[Math.floor(Math.random() * questions.length)];
    }
  }

  const fallbackQuestions = [
    "What is your mind circling back to?",
    "What would make today feel complete?",
    "What are you avoiding thinking about?",
    "What truth are you not writing down?",
    "If today had a title, what would it be?",
  ];
  return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
}
