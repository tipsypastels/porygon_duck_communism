export function random<T>(array: T[], rng = Math.random) {
  return array[Math.floor(rng() * array.length)];
}
