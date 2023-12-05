export default function parseUriList(uriList: string) {
  return uriList.split("\n").filter((line) => !/^#/.test(line));
}
