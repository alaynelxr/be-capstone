const router = require("express").Router();
const { prisma } = require("../utils/connect");
const express = require("express");
const { verifyToken } = require("../middleware/middleware");

// GET /categories (similar to your monorepo code)
// router.get("/", async (req, res) => {
//   try {
//     const lists = await prisma.list.findMany();
//     res.status(200).json(lists);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Something went wrong! Status 500" });
//   }
// });

// module.exports = router;

router.get("/my-lists", verifyToken, async (req, res) => {
  try {
    const userUid = req.user; // The user's Firebase UID from the middleware

    // Assuming you've associated user data with Firebase UID, you can query for the user's saved lists
    const lists = await prisma.list.findMany({
      where: {
        userUid: userUid,
      },
    });

    res.status(200).json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong! Status 500" });
  }
});

module.exports = router;
