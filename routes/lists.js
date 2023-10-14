const router = require("express").Router();
const { prisma } = require("../utils/connect");

router.get("/test", (req, res) => {
  res.send("list test is successful");
});

// GET /categories (similar to your monorepo code)
router.get("/", async (req, res) => {
  try {
    const lists = await prisma.list.findMany();
    res.status(200).json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong! Status 500" });
  }
});

module.exports = router;
