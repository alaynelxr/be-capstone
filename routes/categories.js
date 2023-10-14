const router = require("express").Router();
const { prisma } = require("../utils/connect");

router.get("/test", (req, res) => {
  res.send("test is successful");
});

// GET /categories (similar to your monorepo code)
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong! Status 500" });
  }
});

module.exports = router;
