const timeMultipliers: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

export function toMilliseconds(time: string): number {
  const regex = /^(\d+)([smhd])$/;
  const match = time.match(regex);

  if (!match) {
    throw new Error('Invalid time format. Use a number followed by s, m, h, or d.');
  }
  const [, valueStr, unit] = match;
  const value = parseInt(valueStr, 10);

  return value * timeMultipliers[unit];
}
