export interface SearchItem {
  title: string;
  path: string;
  group?: string;
}

export function applyFilter({
  inputData,
  query,
}: {
  inputData: SearchItem[];
  query: string;
}): SearchItem[] {
  if (!query) return inputData;

  const lowerQuery = query.toLowerCase();

  return inputData.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) || item.path.toLowerCase().includes(lowerQuery)
  );
}

export function groupedData(data: SearchItem[]): Record<string, SearchItem[]> {
  return data.reduce(
    (acc, item) => {
      const group = item.group || '';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, SearchItem[]>
  );
}
