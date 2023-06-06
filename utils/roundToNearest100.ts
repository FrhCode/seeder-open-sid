export default function roundToNearest100(number: number): number {
  return Math.round(number / 100) * 100
}
