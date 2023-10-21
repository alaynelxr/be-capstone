const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;
    console.log("Received Request Body:", req.body);
    console.log("User Data for Creation:", { uid, email, displayName });
    // Create a new user entry in your database, handling the optional displayName
    const newUser = await prisma.user.create({
      data: {
        uid,
        email,
        displayName: displayName || null, // Use displayName if provided, or set to null
      },
    });

    console.log("New User Created:", newUser);

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating a new user:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

module.exports = router;
