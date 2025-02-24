export const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() })) // Assign a random value
      .sort((a, b) => a.sort - b.sort) // Sort based on random value
      .map(({ item }) => item); // Extract shuffled items
  };
  