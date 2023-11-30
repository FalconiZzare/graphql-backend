const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";

const config = require(__dirname + "/../config/config.json")[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//tables
db.game = require("./game")(sequelize, Sequelize);
db.author = require("./author")(sequelize, Sequelize);
db.review = require("./review")(sequelize, Sequelize);

//relations
db.game.hasMany(db.review, { foreignKey: { name: "gameId", allowNull: false } });
db.review.belongsTo(db.game, { foreignKey: { name: "gameId", allowNull: false } });

db.author.hasMany(db.review, { foreignKey: { name: "authorId", allowNull: false } });
db.review.belongsTo(db.author, { foreignKey: { name: "authorId", allowNull: false } });

module.exports = db;
