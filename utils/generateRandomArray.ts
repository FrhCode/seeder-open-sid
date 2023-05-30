function generateRandomArray(
  length: number,
  min_value: number,
  max_value: number
): number[] {
  if (length <= 0 || min_value >= max_value) {
    return [];
  }

  const numbers: number[] = [];

  for (let i = 0; i < length; i++) {
    let randomNumber =
      Math.floor(Math.random() * (max_value - min_value + 1)) + min_value;
    numbers.push(randomNumber);
  }

  numbers.sort((a, b) => a - b);

  return numbers;
}
