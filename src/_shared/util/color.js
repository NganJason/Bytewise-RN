export const getColors = numColors => {
  if (numColors <= DefaultChartColors.length) {
    return DefaultChartColors;
  }
  return genColors(numColors);
};

const genColors = numColors => {
  const colors = [];
  const saturation = 70;
  const lightness = 30; // to create darker color

  for (let i = 0; i < numColors; i++) {
    const hue = (i * (360 / numColors)) % 360;
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colors.push(color);
  }

  return colors;
};

const DefaultChartColors = [
  '#4e79a7',
  '#f28e2c',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc949',
  '#af7aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ac',
  '#a5aad9',
  '#feb74c',
  '#e38690',
  '#d8b5a5',
  '#c9d9d3',
  '#577b96',
  '#f68f5c',
  '#e25e67',
  '#7db8ab',
  '#6ea76c',
  '#f5ce6e',
  '#b68dab',
  '#ffaaa5',
  '#b39580',
  '#c6c3bc',
  '#bcc0d1',
  '#fed36b',
  '#e8a7a9',
  '#d8c5bb',
  '#e0e1d3',
  '#85a1c1',
  '#f7b977',
  '#e87c83',
  '#9ec1b8',
  '#94bc7e',
  '#f7dc8c',
  '#c0a0b2',
  '#ffccc3',
  '#dab9a9',
  '#dedddd',
];
