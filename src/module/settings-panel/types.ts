export interface StatItem {
  label: string;
  value: string | number;
  formatValue?: (value: string | number) => string;
}
