export const getBooleanKeys = (obj) => {
  const filteredObjects = Object.keys(obj).filter((key) => obj[key] === true);

  return filteredObjects;
};
export const getBooleanObject = (obj) => {
  let result = {};
  const filteredObjects = Object.keys(obj).filter((key) => obj[key] === true);
  filteredObjects.forEach((filteredObj) => {
    result = {
      ...result,
      [filteredObj]: obj[filteredObj],
    };
  });
  return result;
};
