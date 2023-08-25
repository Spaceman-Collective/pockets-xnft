import firstMaleList from "../public/name/first-male.json";
import firstFemaleList from "../public/name/first-female.json";
import lastNameList from "../public/name/lastname.json";

export function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

export function isLad(collectionAddress: string) {
  return collectionAddress === "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w";
}

export function isPog(collectionAddress: string) {
  return collectionAddress === "J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w";
}

function generateSeededRandom(seed: number) {
  let m_w = seed;
  let m_z = 987654321;
  const mask = 0xffffffff;

  return function () {
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    let result = ((m_z << 16) + m_w) & mask;
    result /= 4294967296;
    return result + 0.5;
  };
}

export function getRandomName({
  seed,
  isMale,
}: {
  seed?: number;
  isMale: boolean;
}) {
  let randomFirstName, randomLastName;
  const firstNames = isMale ? firstMaleList : firstFemaleList;
  const lastNames = lastNameList;

  if (seed) {
    const seededRandom = generateSeededRandom(seed);
    randomFirstName =
      firstNames[Math.floor(seededRandom() * firstNames.length)];
    randomLastName = lastNames[Math.floor(seededRandom() * lastNames.length)];
  } else {
    randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  }

  return randomFirstName + " " + randomLastName;
}

export function timeAgo(timestamp: number): string {
  const timeDifference = Math.floor(timestamp); // Convert to seconds
  const hours = Math.floor(timeDifference / 3600);
  const minutes = Math.floor((timeDifference % 3600) / 60);
  const seconds = timeDifference % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

export function getLocalImage({
  type,
  name,
}: {
  type: "resources" | "stations" | "units";
  name: string;
}) {
  const transformedName = name.toLowerCase().replace(" ", "_");
  const path = `assets/${type}/${transformedName}.png`;
  return path;
}

export const formatBalance = (balance: number) => {
  let format = "";
  if (balance > 1000000000) {
    format = (balance / 1000000000).toFixed(2) + "B";
  } else if (balance > 1000000) {
    format = (balance / 1000000).toFixed(2) + "M";
  } else if (balance > 1000) {
    format = (balance / 1000).toFixed(2) + "K";
  } else {
    format = balance.toFixed(2);
  }

  return format;
};
