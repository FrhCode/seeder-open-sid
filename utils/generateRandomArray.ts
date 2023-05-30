export default function generateRandomArray(
  length: number,
  min_value: number,
  max_value: number,
  excludedArray: number[] = []
): number[] {
  if (length <= 0 || min_value >= max_value) {
    return [];
  }

  const numbers: number[] = [];

  while (numbers.length < length) {
    let randomNumber =
      Math.floor(Math.random() * (max_value - min_value + 1)) + min_value;

    if (!excludedArray.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }

  numbers.sort((a, b) => a - b);

  return numbers;
}
