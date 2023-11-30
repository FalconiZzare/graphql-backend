const { getMaxCypherQuery } = require("../cyphers");
const getId = async (Node) => {
  try {
    let num;
    const maxId = await getMaxCypherQuery(
      `MATCH (n:${Node}) RETURN MAX(n.id) as maxId`,
      {}
    );

    if (maxId) {
      num = maxId + 1;
    } else {
      num = 1;
    }

    return num;
  } catch (err) {
    console.log(err.message);
  }
};

const getFormattedDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

module.exports = { getId, getFormattedDate };
