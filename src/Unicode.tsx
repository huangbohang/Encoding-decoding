const encodeToUnicode = (text: string) => {
  return text.split('').map((char) => '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4))
    .join('');
}

const decodeUnicode = (text: string) => {
  return text.replace(/\\u[\dA-Fa-f]{4}/g, function(match) {
    return String.fromCharCode(parseInt(match.substring(2), 16));
  });
}

export function encodeUn(input: string): string {
  const output = encodeToUnicode(input);
  return output;
}

export function decodeUn(input: string): string {
  const output = decodeUnicode(input);
  return output;
}
