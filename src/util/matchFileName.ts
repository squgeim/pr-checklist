export function getMatchingFileNames(
  fileNameReg: (string | symbol)[],
  fileName: string
): string[] {
  const matched: string[] = [];

  fileNameReg.forEach(reg => {
    if (typeof reg === 'symbol') {
      return;
    }

    if (RegExp(reg).test(fileName)) {
      matched.push(reg);
    }
  });

  return matched;
}
