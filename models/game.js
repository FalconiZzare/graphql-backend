module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "games",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      platform: {
        type: DataTypes.ARRAY(DataTypes.STRING),
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
