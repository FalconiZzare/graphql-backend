module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "authors",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    },
    {
      timestamps: {
        defaultValue: sequelize.literal("NOW"),
        allowNull: true
      }
    }
  );
};
