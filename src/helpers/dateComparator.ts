export function dateComparator(
  valueA: any,
  valueB: any,
  nodeA?: any,
  nodeB?: any,
  isDescending?: boolean
) {
  const dateA = valueA && new Date(valueA).getTime();
  const dateB = valueB && new Date(valueB).getTime();

  if (isNaN(dateA) && isNaN(dateB)) return 0;
  if (isNaN(dateA)) return isDescending ? -1 : 1;
  if (isNaN(dateB)) return isDescending ? 1 : -1;

  return dateB - dateA;
}
