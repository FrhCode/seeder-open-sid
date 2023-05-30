export default function arrayElement<T>(element: T[]): T {
  return element[Math.floor(Math.random() * element.length)]
}
