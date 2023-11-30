const types = require("neo4j-driver-core");
const {
  isInt,
  isDate,
  isPoint,
  isTime,
  isDateTime,
  isLocalTime,
  isLocalDateTime,
  isDuration
} = require("neo4j-driver-core");

const mapObjectValues = (object, mapper) => {
  return Object.entries(object).reduce((res, [currKey, currVal]) => {
    res[currKey] = mapper(currVal);
    return res;
  }, {});
};

const upperFirst = (str) => str[0].toUpperCase() + str.slice(1);
const getDriverTypeName = (val) => {
  const driverTypeMap = types;
  const driverTypes = Object.keys(types);
  for (const type of driverTypes) {
    if (val instanceof driverTypeMap[type]) {
      return type;
    }
  }
  return undefined;
};


const getPropertyTypeDisplayName = (val) => {
  const jsType = typeof val;
  const complexType = jsType === "object";

  if (jsType === "number") {
    if ([Infinity, -Infinity, NaN].includes(val)) {
      return "String";
    }

    return Number.isInteger(val) ? "Integer" : "Float";
  }

  if (!complexType) {
    return upperFirst(jsType);
  }

  if (val instanceof Array) {
    if (val.length > 0) {
      return `List<${getPropertyTypeDisplayName(val[0])}>(${val.length})`;
    }
    return `List(${val.length})`;
  }

  if (val === null) {
    return "null";
  }

  return getDriverTypeName(val) || "Unknown";
};

const numberFormat = (anything) => {
  if ([Infinity, -Infinity, NaN].includes(anything)) {
    return `${anything}`;
  }

  // if (Math.floor(anything) === anything) {
  //   return `${anything}.0`;
  // }

  if (Number(anything)) {
    return anything;
  }

  return anything.toString();
};

const spacialFormat = (anything) => {
  const zString = anything.z !== undefined ? `, z:${anything.z}` : "";
  return `point({srid:${anything.srid}, x:${anything.x}, y:${anything.y}${zString}})`;
};

const isCypherTemporalType = (anything) => {
  return (
    isDate(anything) ||
    isTime(anything) ||
    isDateTime(anything) ||
    isLocalTime(anything) ||
    isLocalDateTime(anything) ||
    isDuration(anything)
  );
};

const propertyToString = (property) => {
  if (Array.isArray(property)) {
    return `[${property.map(propertyToString).join(", ")}]`;
  }
  if (property === null) {
    return "null";
  }
  if (typeof property === "boolean") {
    return property.toString();
  }
  if (isInt(property)) {
    return property.toString();
  }
  if (typeof property === "bigint") {
    return property.toString();
  }
  if (typeof property === "number") {
    return numberFormat(property);
  }

  if (typeof property === "string") {
    return `"${property}"`;
  }

  if (property.constructor === Int8Array) {
    return "ByteArray";
  }

  if (isCypherTemporalType(property)) {
    return property.toString();
  }

  if (isPoint(property)) {
    return spacialFormat(property);
  }

  return String(property);
};

module.exports = {
  mapObjectValues,
  propertyToString,
  getPropertyTypeDisplayName
};