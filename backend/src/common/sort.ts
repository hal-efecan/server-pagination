/* eslint-disable prettier/prettier */
export function sortByBody(a, b, sortBody) {
  if (sortBody === 'asc') {
    const firstLetterA = a.body[0];
    const firstLetterB = b.body[0];
    return firstLetterA.localeCompare(firstLetterB);
  }

  if (sortBody === 'desc') {
    const firstLetterA = a.body[0];
    const firstLetterB = b.body[0];
    return firstLetterB.localeCompare(firstLetterA);
  }
}

export function sortById(a, b, sortId) {
  if (sortId === 'asc') {
    return a.id - b.id;
  }

  if (sortId === 'desc') {
    return b.id - a.id;
  }

  if (sortId === null) {
    return a.id - b.id;
  }
}
