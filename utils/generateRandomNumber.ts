export default function generateRandomNumber(
  start: number,
  end: number,
  exclude?: number[]
): number {
  let randomNum: number;

  if ((exclude != null) && exclude.length > 0) {
    do {
      randomNum = Math.floor(Math.random() * (end - start + 1)) + start;
    } while (exclude.includes(randomNum));
  } else {
    randomNum = Math.floor(Math.random() * (end - start + 1)) + start;
  }

  return randomNum;
}
