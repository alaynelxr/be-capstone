const router = require("express").Router();
const { prisma } = require("../utils/connect");

router.get("/test", (req, res) => {
  res.send("moves test is successful");
});

// GET ALL MOVES at /moves
// router.get("/", async (req, res) => {
//   try {
//     const moves = await prisma.move.findMany({
//       include: {
//         difficulty: true, // Include the 'difficulty' relation
//         categories: true, // Include the 'category' relation
//       },
//     });
//     res.status(200).json(moves);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Something went wrong! Status 500" });
//   }
// });

// NEW GET moves with query parameters
router.get("/", async (req, res) => {
  const { query } = req.query;

  try {
    let moves;
    if (query) {
      moves = await prisma.move.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              aliases: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          difficulty: true,
          categories: true,
        },
      });
    } else {
      // If there's no query, return all data
      moves = await prisma.move.findMany({
        include: {
          difficulty: true,
          categories: true,
        },
      });
    }

    res.status(200).json(moves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong! Status 500" });
  }
});

// GET ONE MOVE at /move/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const move = await prisma.move.findUnique({
      where: {
        id: id,
      },
      include: {
        difficulty: true, // Include the 'difficulty' relation
        categories: true, // Include the 'category' relation
      },
    });

    if (!move) {
      return res.status(404).json({ message: "Move not found" });
    }

    res.status(200).json(move);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  } finally {
    await prisma.$disconnect(); // Disconnect from the database after the request
  }
});

// POST a new move at /add

router.post("/add", async (req, res) => {
  const newmove = req.body.newmove;
  console.log(newmove);
  res.send("your new move is " + newmove);
});

module.exports = router;
