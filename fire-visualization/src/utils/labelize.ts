/**
 * Given string in camelCase format, try to create more human friendly form
 */
export const labelize = (str: string): string => {
  //const withSpaces = str.split(/\p{Lu}/u).join(" ")
  //return withSpaces[0].toUpperCase() + withSpaces.slice(1)
  const interestingPart = str.substring(str.indexOf('.') + 1);
  const words = interestingPart.replace(/([a-z])([A-Z])/g, '$1 $2').split(/(?=[A-Z])/);

  // Capitalize the first letter of each word and join them
  // with a space
  const humanFriendly = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return humanFriendly;
};
