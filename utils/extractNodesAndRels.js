const {
  mapObjectValues,
  propertyToString,
  getPropertyTypeDisplayName
} = require("./driverUtils");
const {
  isRelationship,
  isPath,
  isNode
} = require("neo4j-driver-core");

const extractUniqueNodesAndRels = (
  records,
  nodeLimit,
  keepDanglingRels
) => {
  let limitHit = false;

  if (records.length === 0) {
    return { nodes: [], relationships: [] };
  }

  const items = new Set();

  for (const record of records) {
    for (const key of record.keys) {
      items.add(record.get(key));
    }
  }

  const paths = [];

  const nodeMap = new Map();

  const addNode = (n) => {
    if (!limitHit) {
      const id = n.identity.toString();

      if (!nodeMap.has(id)) {
        nodeMap.set(id, n);
      }

      if (typeof nodeLimit === "number" && nodeMap.size === nodeLimit) {
        limitHit = true;
      }
    }
  };

  const relMap = new Map();

  const addRel = (r) => {
    const startId = r.start.toString();
    const endId = r.end.toString();
    const compositeKey = `${startId}_${endId}`;

    if (!relMap.has(compositeKey)) {
      relMap.set(compositeKey, r);
    }
  };

  const findAllEntities = (item) => {
    if (typeof item !== "object" || !item) {
      return;
    }

    if (isRelationship(item)) {
      addRel(item);
    } else if (isNode(item)) {
      addNode(item);
    } else if (isPath(item)) {
      paths.push(item);
    } else if (Array.isArray(item)) {
      item.forEach(findAllEntities);
    } else {
      Object.values(item).forEach(findAllEntities);
    }
  };

  findAllEntities(Array.from(items));

  for (const path of paths) {
    if (path.start) {
      addNode(path.start);
    }
    if (path.end) {
      addNode(path.end);
    }
    for (const segment of path.segments) {
      if (segment.start) {
        addNode(segment.start);
      }
      if (segment.end) {
        addNode(segment.end);
      }
      if (segment.relationship) {
        addRel(segment.relationship);
      }
    }
  }

  const nodes = Array.from(nodeMap.values()).map(item => {
    return {
      id: item.identity.toString(),
      elementId: item.elementId,
      labels: item.labels,
      properties: mapObjectValues(item.properties, propertyToString),
      propertyTypes: mapObjectValues(
        item.properties,
        getPropertyTypeDisplayName
      )
    };
  });

  const relationships = Array
    .from(relMap.values())
    .filter(item => {
      if (keepDanglingRels) {
        return true;
      }

      const start = item.start.toString();
      const end = item.end.toString();
      const compositeKey = `${start}_${end}`;
      return nodeMap.has(start) && nodeMap.has(end) && relMap.has(compositeKey);
    })
    .map(item => {
      return {
        id: item.identity.toString(),
        elementId: item.elementId,
        startNodeId: item.start.toString(),
        endNodeId: item.end.toString(),
        type: item.type,
        properties: mapObjectValues(item.properties, propertyToString),
        propertyTypes: mapObjectValues(
          item.properties,
          getPropertyTypeDisplayName
        )
      };
    });

  return { nodes, relationships };
};

module.exports = { extractUniqueNodesAndRels };