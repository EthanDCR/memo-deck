export function extractFileName(filePath: string): string {
  const parts = filePath.split("/");
  return parts.pop() || filePath;
}

export function extractFileNames(filePaths: string[]): string[] {
  return filePaths.map(extractFileName);
}
