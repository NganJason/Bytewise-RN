export const genColors = numColors => {
  const colors = [];
  const saturation = 70;
  const lightness = 30; // Adjust this to create darker colors

  for (let i = 0; i < numColors; i++) {
    const hue = (i * (360 / numColors)) % 360;
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colors.push(color);
  }

  return colors;
};
