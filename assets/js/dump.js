// AI Logic by Difficulty
function getAIChoice(playerHistory = [], difficulty = "easy") {
  switch (difficulty) {
    case "easy":
      return choices[Math.floor(Math.random() * choices.length)];

    case "medium":
      if (playerHistory.length === 0) return randomChoice();
      const lastMove = playerHistory[playerHistory.length - 1];
      const counters = choices.filter(choice => beats[choice].includes(lastMove));
      return weightedChoice(counters, 0.4); // 40% chance to counter

    case "hard":
      if (playerHistory.length === 0) return randomChoice();
      const freq = mostFrequent(playerHistory);
      const hardCounters = choices.filter(choice => beats[choice].includes(freq));
      return weightedChoice(hardCounters, 0.7); // 70% chance to counter

    default:
      return randomChoice();
  }
}

// Helper Functions
// function randomChoice() {
//   return choices[Math.floor(Math.random() * choices.length)];
// }

// function mostFrequent(arr) {
//   const count = {};
//   arr.forEach(item => count[item] = (count[item] || 0) + 1);
//   return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
// }

function weightedChoice(preferred, weight = 0.5) {
  const pool = choices.flatMap(choice =>
    preferred.includes(choice) ? Array(Math.round(weight * 10)).fill(choice) : [choice]
  );
  return pool[Math.floor(Math.random() * pool.length)];
}