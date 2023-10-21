const router = require("express").Router();
const { prisma } = require("../utils/connect");
const { verifyToken } = require("../middleware/middleware");

router.get("/test", (req, res) => {
  res.send("moves test is successful");
});

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

// POST a new move at /add given that the user is logged in
router.post("/add", verifyToken, async (req, res) => {
  console.log("making post /moves/add api call");
  try {
    const { title, desc, difficulty, categories, alias, level } = req.body;
    const userUid = req.user;

    // Create a new move entry associated with the user
    const newMove = await prisma.move.create({
      data: {
        title,
        desc,
        img: "",
        difficulty: {
          connect: { id: difficulty }, // Assuming `difficulty` is the ID of the existing difficulty
        },
        categories: {
          connect: categories.map((categoryId) => ({ id: categoryId })), // Assuming `categories` is an array of category IDs
        },

        creator: {
          connect: {
            uid: userUid,
          },
        },
        alias: {
          create: alias.map((aliasName) => ({ name: aliasName })),
        },
        // proficiencies,
      },
    });

    // Create a new Proficiency entry associated with the user and the newly created move
    const newProficiency = await prisma.proficiency.create({
      data: {
        level: level,
        move: {
          connect: {
            id: newMove.id, // Connect to the newly created move
          },
        },
        user: {
          connect: {
            uid: userUid,
          },
        },
      },
    });

    res.status(201).json(newMove);
  } catch (error) {
    console.error("Error adding a new move:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

module.exports = router;
