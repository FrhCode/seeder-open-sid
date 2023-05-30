export default async function reject(ms: number) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      reject("");
    }, ms)
  );
}
