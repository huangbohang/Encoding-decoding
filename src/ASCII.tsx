const encodeToAscii = (text: string) => {
  let encoded = '';
  for (let i = 0; i < text.length; i++) {
    encoded += text.charCodeAt(i) + ' ';
  }
  return encoded.trim();
}

const decodeAscii = (text: string) => {
  const codes = text.split(' ');
  let decoded = '';
  for (let i = 0; i < codes.length; i++) {
    decoded += String.fromCharCode(parseInt(codes[i]));
  }
  return decoded;
}

export function encodeAs(input: string): string {
  const output = encodeToAscii(input);
  return output;
}

export function decodeAs(input: string): string {
  const output = decodeAscii(input);
  return output;
}