export const capitalizeWords = str => {
  var words = str.split(' ');

  for (var i = 0; i < words.length; i++) {
    words[i] =
      words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }

  var capitalizedString = words.join(' ');
  return capitalizedString;
};
