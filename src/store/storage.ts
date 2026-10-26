// Small helper that loads and saves store/data.json.
// The phone can't write into the project folder, so the first time the app opens
// it copies store/data.json to the phone's document folder. All saves go to that copy.
// (If Expo complains about this import, change it to: 'expo-file-system')
import * as FileSystem from 'expo-file-system/legacy';
import starterData from './data.json';
import { AppData, Course } from '../types';

const SAVE_PATH = FileSystem.documentDirectory + 'data.json';

// Reads the save file (creates it from the starter data on first launch).
export async function loadData(): Promise<AppData> {
  const info = await FileSystem.getInfoAsync(SAVE_PATH);
  if (!info.exists) {
    await FileSystem.writeAsStringAsync(SAVE_PATH, JSON.stringify(starterData));
  }
  const text = await FileSystem.readAsStringAsync(SAVE_PATH);
  return JSON.parse(text);
}

// Writes the whole data object back to the save file.
export async function saveData(data: AppData): Promise<void> {
  await FileSystem.writeAsStringAsync(SAVE_PATH, JSON.stringify(data));
}

// Progress of a course = answered cards / total cards * 100.
export function getProgress(course?: Course): number {
  if (!course || course.cards.length === 0) return 0;
  const answered = course.cards.filter((c) => c.status !== 'unanswered').length;
  return Math.round((answered / course.cards.length) * 100);
}
