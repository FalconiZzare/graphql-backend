module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "reviews",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
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
