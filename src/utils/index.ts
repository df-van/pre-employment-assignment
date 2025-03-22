function formatToWon(value: number | string): string {
  const numberValue = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(numberValue)) {
    return "";
  }
  return numberValue.toLocaleString("ko-KR");
}

function parseWonString(value: string): number {
  if (!value) return 0;
  // 문자열에서 쉼표 제거 후 숫자로 변환
  const numericValue = parseFloat(value.replace(/,/g, ""));
  return isNaN(numericValue) ? 0 : numericValue;
}

export { formatToWon, parseWonString };
