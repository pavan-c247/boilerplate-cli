export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  queryKey?: string; // default: "search"
  debounceDelay?: number; // default: 500
  onSearch?: (value: string) => void;
}

export interface UseSearchOptions {
  queryKey: string;
  debounceDelay: number;
}
