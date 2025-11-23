export interface SearchResult {
  doi: string | null;
  title: string | null;
  rawText: string;
  sources: Array<{
    title: string;
    uri: string;
  }>;
}

export interface HistoryItem {
  id: string;
  reference: string;
  doi: string | null;
  timestamp: number;
}