export const capitalize = str => {
  var words = str.split(' ');

  for (var i = 0; i < words.length; i++) {
    words[i] =
      words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }

  var capitalizedString = words.join(' ');
  return capitalizedString;
};

export const capitalizeFirstWord = str => {
  var words = str.split(' ');
  if (words.length === 0) {
    return str;
  }

  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  return words.join(' ');
};
