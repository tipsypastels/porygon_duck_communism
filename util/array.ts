export function random<T>(array: T[], rng = Math.random) {
  return array[Math.floor(rng() * array.length)];
}

export function randomN<T>(n: number, array: T[], rng = Math.random) {
  const out: T[] = [];
  const seenIndexes = new Set<number>();
  const cappedN = Math.min(n, array.length);

  let i = 0;

  do {
    const index = Math.floor(rng() * array.length);
    if (seenIndexes.has(index)) continue;

    out.push(array[index]);
    seenIndexes.add(index);
    i++;
  } while (i < cappedN);

  return out;
}

export function toSentence<T>(
  array: T[],
  {
    wordConnector = ", ",
    twoWordConnector = " and ",
    finalWordConnector = ", and ",
    convert = (elem: T) => `${elem}`,
  } = {},
) {
  switch (array.length) {
    case 0: {
      return "";
    }
    case 1: {
      return convert(array[0]);
    }
    case 2: {
      return `${convert(array[0])}${twoWordConnector}${convert(array[1])}`;
    }
    default: {
      const end = convert(array.at(-1)!);
      const main = array.slice(0, -1).map(convert).join(wordConnector);
      return `${main}${finalWordConnector}${end}`;
    }
  }
}
