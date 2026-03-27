import { format } from "date-fns";

export interface JournalEntry {
  text: string;
  mood: string | null;
  insights: string | null;
  tasks: string[];
}

const STORAGE_KEY = "inkwell_journal";

function getAll(): Record<string, JournalEntry> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getEntry(date: Date): JournalEntry {
  const key = format(date, "yyyy-MM-dd");
  const all = getAll();
  return all[key] || { text: "", mood: null, insights: null, tasks: [] };
}

export function saveEntry(date: Date, entry: JournalEntry) {
  const key = format(date, "yyyy-MM-dd");
  const all = getAll();
  all[key] = entry;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
