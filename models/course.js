const { Model, DataTypes } = require("sequelize");
const { sequelize } = require(".");

//Model of the course 

module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init( //initialize the model
    {
      title: {
        type: DataTypes.STRING,//datatype of the property
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Provide a title for the course", //message to be displayed if error occurs
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Provide a description for the course",
          },
        },
      },
      estimatedTime: {
        type: DataTypes.STRING,
      },
      materialsNeeded: {
        type: DataTypes.STRING,
      },
    },
    { sequelize }
  );

  //Define a belongsTo association between course and user
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: "User",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return Course;
};