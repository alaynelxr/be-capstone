const router = require("express").Router();
const { prisma } = require("../utils/connect");

router.get("/test", (req, res) => {
  res.send("difficulty test is successful");
});

// GET /categories (similar to your monorepo code)
router.get("/", async (req, res) => {
  try {
    const difficulties = await prisma.difficulty.findMany();
    res.status(200).json(difficulties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong! Status 500" });
  }
});

module.exports = router;
