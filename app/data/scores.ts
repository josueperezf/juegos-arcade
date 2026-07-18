export interface SavedScore {
  gameId: string;
  name: string;
  score: number;
  at: number; // timestamp
}

const savedScores: SavedScore[] = [];

export function saveScore(entry: SavedScore): void {
  savedScores.push(entry);
}

export function getScoresForGame(gameId: string): SavedScore[] {
  return savedScores.filter((s) => s.gameId === gameId);
}
