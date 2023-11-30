const neo4j = require("neo4j-driver");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/neo4j.json")[env];
const { extractUniqueNodesAndRels: extract } = require("../utils/extractNodesAndRels");

const driver = neo4j.driver(config.uri, neo4j.auth.basic(config.username, config.password), {
  maxConnectionLifetime: 3 * 60 * 60 * 1000, //3 hours
  maxConnectionPoolSize: 50,
  connectionAcquisitionTimeout: 2 * 60 * 1000, //120 seconds
  disableLosslessIntegers: true
});

const formatResponse = (response, criteria) => {
  const result = [];
  if (criteria) {
    return response.records[0]._fields[0].properties;
  } else {
    if (response.records.length > 0) {
      response.records.map(record => {
        result.push(record._fields[0].properties);
      });
    }
  }
  return result;
};

const executeCypherQuery = async (statement, params = {}, expectSingleObj) => {
  try {
    const session = driver.session();

    const result = await session.run(statement, params);

    await session.close();

    const { nodes, relationships } = extract(result.records);

    const data = formatResponse(result, expectSingleObj);

    return { data, nodes, relationships };
  } catch (err) {
    console.log(err);
  }
};

const getMaxCypherQuery = async (statement, params = {}) => {
  try {
    const session = driver.session();

    const result = await session.run(statement, params);

    await session.close();

    return result.records[0]._fields[0];
  } catch (err) {
    console.log(err);
  }
};

module.exports = { executeCypherQuery, getMaxCypherQuery };