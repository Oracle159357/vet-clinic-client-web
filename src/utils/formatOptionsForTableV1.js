export default function formatOptions(options) {
  const { paging, sorting, filters } = options;

  const formattedSorting = (sorting ?? [])
    .filter((column) => column.direction !== null)
    .map((column) => ({ id: column.key, desc: column.direction === 'desc' }));

  const formattedFilters = Object.entries(filters ?? {})
    .filter(([, { valueFilter }]) => {
      if (valueFilter === undefined || valueFilter === null) {
        return false;
      }

      if (typeof valueFilter === 'object') {
        return Object.values(valueFilter).some((value) => value !== undefined);
      }

      return true;
    })
    .map(([id, { valueFilter }]) => ({ id, value: valueFilter }));

  return {
    paging,
    sorting: formattedSorting.length ? formattedSorting : undefined,
    filters: formattedFilters.length ? formattedFilters : undefined,
  };
}
