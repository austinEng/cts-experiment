const url = new URL(window.location.toString());

export function optionEnabled(
  opt: string,
  searchParams: URLSearchParams = url.searchParams
): boolean {
  const val = searchParams.get(opt);
  return val !== null && val !== '0';
}
