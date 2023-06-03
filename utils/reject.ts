export default async function reject(ms: number): Promise<unknown> {
  return await new Promise((resolve, reject) =>
    setTimeout(() => {
      reject(new Error('fail'))
    }, ms)
  )
}
