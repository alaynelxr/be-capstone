const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/add", async (req, res) => {
  console.log("making post /difficulty/add api call");
  try {
    const { title } = req.body;
    // Create a new move entry associated with the user
    const difficulty = await prisma.difficulty.upsert({
      where: { title: title },
      create: {
        title: title,
        // include other fields if necessary
      },
      update: {}, // update fields if necessary
    });

    res.status(201).json(difficulty);
  } catch (error) {
    console.error("Error adding a new move:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

module.exports = router;
