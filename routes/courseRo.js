const express = require("express");

//from middleware folder
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/auth-user");

//from models folder
const { User, Course } = require("../models");

const router = express.Router();

//return list of courses
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      },
    });
    res.status(200).json({
      courses,
    });
  })
);

//return course by id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: User,
        as: "user",
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      },
    });
    res.status(200).json({
      course,
    });
  })
);

//create courses
router.post(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create({
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded,
        userId: req.currentUser.id,
      });
      res.status(201).location(`/${course.id}`).end();
    } catch (error) {
      console.log("ERROR: ", error);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//update course
router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (req.currentUser.id === course.userId) {
        await course.update(req.body);
        res.status(204).location(`/${req.params.id}`).end();
      } else {
        res
          .status(403)
          .json({ error: "You cannot update course that you dont owned" });
      }
    } catch (error) {
      console.log("ERROR: ", error);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//delete course
router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (req.currentUser.id === course.userId) {
        await course.destroy();
        res.status(204).location("/").end();
      } else {
        res
          .status(403)
          .json({ error: "You cannot destroy a course that you dont owned" });
      }
    } catch (error) {
      console.log("ERROR: ", error);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;