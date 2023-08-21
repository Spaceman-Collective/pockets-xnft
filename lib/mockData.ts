export const generateMockFactions = Array.from({ length: 40 }, (_, index) => ({
  id: `faction_${index + 1}`,
  name: `Faction ${index + 1}`,
  image: `https://example.com/faction_${index + 1}.jpg`,
  favorPoints: getRandomNumber(100, 1000),
  domWins: getRandomNumber(10, 200),
  wealthPoints: getRandomNumber(500, 5000),
  knowledgePoints: getRandomNumber(50, 500),
}));

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
