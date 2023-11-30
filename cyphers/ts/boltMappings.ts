// import { flatten, map, take } from 'lodash-es'
const flatten = require('lodash/flatten')
const map = require('lodash/map');
const take = require('lodash/take');
const neo4j = require("neo4j-driver");
const { stringModifier } = require('./cypherTypesFormatting.ts')

const collectHits = function (operator: any) {
  let hits = operator.DbHits || 0
  if (operator.children) {
    hits = operator.children.reduce((acc: any, subOperator: any) => {
      return acc + collectHits(subOperator)
    }, hits)
  }
  return hits
}

interface Converters {
  intChecker: (item: {}) => boolean
  intConverter: (item: {}) => any
  objectConverter?: (item: {}, converters: Converters) => any
}

function arrayIntToString(arr: {}[], converters: Converters) {
  return arr.map(item => itemIntToString(item, converters))
}

function itemIntToString(item: any, converters: Converters): any {
  const res = stringModifier(item)
  if (res) return res
  if (converters.intChecker(item)) return converters.intConverter(item)
  if (Array.isArray(item)) return arrayIntToString(item, converters)
  if (['number', 'string', 'boolean'].indexOf(typeof item) !== -1) return item
  if (item === null) return item
  if (typeof item === 'object') return objIntToString(item, converters)
}

function objIntToString(obj: any, converters: any) {
  const entry = converters.objectConverter(obj, converters)
  let newObj: any = null
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

export function extractRawNodesAndRelationShipsFromRecords(
  records: Record<string, any>[],
  types = neo4j.types,
  maxFieldItems: any
) {
  const items = new Set<any>()
  const paths = new Set<any>()
  const segments = new Set<any>()
  const rawNodes = new Set<any>()
  const rawRels = new Set<any>()

  for (const record of records) {
    for (const key of record.keys) {
      items.add(record.get(key))
    }
  }

  const flatTruncatedItems = flatten(
    // @ts-ignore
    map([...items], item =>
      maxFieldItems && Array.isArray(item) ? take(item, maxFieldItems) : item
    )
  )

  const findAllEntities = (item: any) => {
    if (item instanceof (types.Relationship as any)) {
      rawRels.add(item)
      return
    }
    if (item instanceof (types.Node as any)) {
      rawNodes.add(item)
      return
    }
    if (item instanceof (types.Path as any)) {
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
      return
    }
  }

  findAllEntities(flatTruncatedItems)

  // @ts-ignore
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

  // @ts-ignore
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

  // @ts-ignore
  return { rawNodes: [...rawNodes], rawRels: [...rawRels] }
}

export function extractNodesAndRelationshipsFromRecords(
  records: Record<string, any>[],
  types = neo4j.types,
  maxFieldItems?: any
) {
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