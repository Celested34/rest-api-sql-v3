const bcrypt = require("bcryptjs/dist/bcrypt");
const { Model, DataTypes } = require("sequelize");
const { sequelize } = require(".");

// Model of user

module.exports = (sequelize) => {
  class User extends Model {}
  User.init( //initialize the model
    {
      firstName: {
        type: DataTypes.STRING, //datatype of the property
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enter a first name",//message to be displayed if error occurs
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Please enter a last name",
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email already exists",
        },
        validate: {
          notNull: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Provide a valid email address",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
        },
        set(val) { //hashes the users password
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue("password", hashedPassword);
        },
      },
    },
    { sequelize }
  );

  // define a hasMany association between user and course 
  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: "User",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return User;
};