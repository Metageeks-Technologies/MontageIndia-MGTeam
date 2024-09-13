export const truncateWords = (str: string, numWords: number): string => {
  const words = str.split(' ');
  if (words.length <= numWords) {
    return str;
  }
  return words.slice(0, numWords).join(' ') + '...';
};