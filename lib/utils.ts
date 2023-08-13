export function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

export function isLad(collectionAddress: string) {
  return collectionAddress === "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w";
}
