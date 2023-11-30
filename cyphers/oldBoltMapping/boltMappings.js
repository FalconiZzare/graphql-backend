const flatten = require('lodash/flatten')
const map = require('lodash/map');
const take = require('lodash/take');
const neo4j = require("neo4j-driver");
const { stringModifier } = require('./cypherTypesFormatting')

function arrayIntToString(arr, converters) {
  return arr.map(item => itemIntToString(item, converters))
}

function itemIntToString(item, converters) {
  const res = stringModifier(item)
  if (res) return res
  if (converters.intChecker(item)) return converters.intConverter(item)
  if (Array.isArray(item)) return arrayIntToString(item, converters)
  if (['number', 'string', 'boolean'].indexOf(typeof item) !== -1) return item
  if (item === null) return item
  if (typeof item === 'object') return objIntToString(item, converters)
}

function objIntToString(obj, converters) {
  const entry = converters.objectConverter(obj, converters)
  let newObj = null
  if (Array.isArray(entry)) {
    newObj = entry.map(item => itemIntToString(item, converters))
  } else if (entry !== null && typeof entry === 'object') {
    newObj = {}
    Object.keys(entry).forEach(key => {
      newObj[key] = itemIntToString(entry[key], converters)
    })
  }
  return newObj
}

function extractRawNodesAndRelationShipsFromRecords(records, types = neo4j.types, maxFieldItems) {
  const items = new Set()
  const paths = new Set()
  const segments = new Set()
  const rawNodes = new Set()
  const rawRels = new Set()
  for (const record of records) {
    for (const key of record.keys) {
      items.add(record.get(key))
    }
  }
  const flatTruncatedItems = flatten(
    map([...items], item =>
      maxFieldItems && Array.isArray(item) ? take(item, maxFieldItems) : item
    )
  )
  const findAllEntities = (item) => {
    if (item instanceof types.Relationship) {
      rawRels.add(item)
      return
    }
    if (item instanceof types.Node) {
      rawNodes.add(item)
      return
    }
    if (item instanceof types.Path) {
      paths.add(item)
      return
    }
    if (Array.isArray(item)) {
      for (const subItem of item) {
        findAllEntities(subItem)
      }
      return
    }
    if (item && typeof item === 'object') {
      for (const subItem of Object.values(item)) {
        findAllEntities(subItem)
      }

    }
  }
  findAllEntities(flatTruncatedItems)
  for (const path of paths) {
    if (path.start) {
      rawNodes.add(path.start)
    }
    if (path.end) {
      rawNodes.add(path.end)
    }
    for (const segment of path.segments) {
      segments.add(segment)
    }
  }
  for (const segment of segments) {
    if (segment.start) {
      rawNodes.add(segment.start)
    }
    if (segment.end) {
      rawNodes.add(segment.end)
    }
    if (segment.relationship) {
      rawRels.add(segment.relationship)
    }
  }
  return { rawNodes: [...rawNodes], rawRels: [...rawRels] }
}

function extractNodesAndRelationshipsFromRecords(records, types = neo4j.types, maxFieldItems) {
  if (records.length === 0) {
    return { nodes: [], relationships: [] }
  }
  const { rawNodes, rawRels } = extractRawNodesAndRelationShipsFromRecords(
    records,
    types,
    maxFieldItems
  )
  return { nodes: rawNodes, relationships: rawRels }
}

module.exports = {extractNodesAndRelationshipsFromRecords}


