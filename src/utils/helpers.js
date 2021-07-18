export const getBooleanKeys = (obj) => {
  if (!obj) return obj;
  const filteredObjects = Object.keys(obj).filter(
    (key) => typeof obj[key] === "boolean"
  );

  return filteredObjects;
};
export const getStringKeys = (obj) => {
  if (!obj) return obj;
  const filteredObjects = Object.keys(obj).filter(
    (key) => typeof obj[key] === "string"
  );

  return filteredObjects;
};
export const getBooleanObject = (obj) => {
  if (!obj) return obj;
  let result = {};
  const filteredObjects = Object.keys(obj).filter(
    (key) => typeof obj[key] === "boolean"
  );
  filteredObjects.forEach((filteredObj) => {
    result = {
      ...result,
      [filteredObj]: obj[filteredObj],
    };
  });
  return result;
};
export const getStringObject = (obj) => {
  if (!obj) return obj;
  let result = {};
  const filteredObjects = Object.keys(obj).filter(
    (key) => typeof obj[key] === "string"
  );
  filteredObjects.forEach((filteredObj) => {
    result = {
      ...result,
      [filteredObj]: obj[filteredObj],
    };
  });
  return result;
};
