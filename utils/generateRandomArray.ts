export default function generateRandomArray(
  length: number,
  minValue: number,
  maxValue: number,
  excludedArray: number[] = []
): number[] {
  if (length <= 0 || minValue >= maxValue) {
    return []
  }

  const numbers: number[] = []

  while (numbers.length < length) {
    const randomNumber =
      Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue

    if (!excludedArray.includes(randomNumber)) {
      numbers.push(randomNumber)
    }
  }

  numbers.sort((a, b) => a - b)

  return numbers
}
