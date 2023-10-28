const router = require("express").Router();
const { prisma } = require("../utils/connect");
const { verifyToken } = require("../middleware/middleware");

router.get("/test", (req, res) => {
  res.send("moves test is successful");
});

// new GET all for signed in
router.get("/loggedIn", verifyToken, async (req, res) => {
  const userUid = req.user;
  const { query } = req.query;

  const user = await prisma.user.findUnique({
    where: { uid: userUid },
  });

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
                some: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              AND: [
                {
                  creatorId: user ? user.id : null,
                },
                {
                  creatorId: null,
                },
              ],
            },
          ],
        },
        include: {
          difficulty: true,
          categories: true,
          alias: true,
        },
      });
    } else {
      // If there's no query, return all data
      moves = await prisma.move.findMany({
        where: {
          OR: [
            {
              creatorId: user ? user.id : null,
            },
            {
              creatorId: null,
            },
          ],
        },
        include: {
          difficulty: true,
          categories: true,
          alias: true,
        },
      });
    }

    res.status(200).json(moves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong! Status 500" });
  }
});

// new GET all for not signed in
router.get("/public", async (req, res) => {
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
            {
              creatorId: null,
            },
          ],
        },
        include: {
          difficulty: true,
          categories: true,
          alias: true,
        },
      });
    } else {
      // If there's no query, return moves with no creatorId
      moves = await prisma.move.findMany({
        where: {
          creatorId: null,
        },
        include: {
          difficulty: true,
          categories: true,
          alias: true,
        },
      });
    }

    res.status(200).json(moves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong! Status 500" });
  }
});

// get specific move given user is logged in
router.get("/:id/loggedIn", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userUid = req.user; // Obtain user's UID from your authentication mechanism (e.g., Firebase Auth)

    const move = await prisma.move.findUnique({
      where: {
        id: id,
      },
      include: {
        difficulty: true,
        categories: true,
        alias: true,
      },
    });

    if (!move) {
      return res.status(404).json({ message: "Move not found" });
    }

    if (userUid) {
      const userProficiency = await prisma.proficiency.findFirst({
        where: {
          user: {
            uid: userUid,
          },
          moveId: id,
        },
      });
      console.log("User's Proficiency (Backend):", userProficiency);
      move.userProficiency = userProficiency;
    }

    res.status(200).json(move);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  } finally {
    await prisma.$disconnect();
  }
});

// get specific move given user is not logged in
router.get("/:id/public", async (req, res) => {
  try {
    const { id } = req.params;

    const move = await prisma.move.findUnique({
      where: {
        id: id,
      },
      include: {
        difficulty: true,
        categories: true,
        alias: true,
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
    await prisma.$disconnect();
  }
});

// update user's proficiency for a move

router.patch("/:moveId/updateProficiency", verifyToken, async (req, res) => {
  const { moveId } = req.params;
  const { updatedProficiencyLevel } = req.body; // Get the updated proficiency level from the request body

  try {
    const userUid = req.user; // Obtain the user's UID from your authentication mechanism (e.g., Firebase Auth)
    console.log(moveId, "moveid");
    // Use Prisma to update the user's proficiency for this move
    const updatedProficiency = await prisma.proficiency.upsert({
      where: {
        moveId_userUid: {
          moveId: moveId,
          userUid: userUid,
        },
      },
      update: {
        level: updatedProficiencyLevel,
      },
      create: {
        moveId: moveId,
        userUid: userUid,
        level: updatedProficiencyLevel,
      },
    });

    res.status(200).json(updatedProficiency);
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

//  Delete custom move given that user is logged in
router.delete("/:id/loggedIn", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userUid = req.user; // Obtain user's UID from your authentication mechanism (e.g., Firebase Auth)
    console.log(userUid, "userUid");
    console.log(id, "moveId");
    // Check if the move exists
    const move = await prisma.move.findUnique({
      where: {
        id: id,
      },
    });

    if (!move) {
      return res.status(404).json({ message: "Move not found" });
    }

    // Check if the user has permission to delete the move (based on userId and creatorId)
    if (userUid) {
      const user = await prisma.user.findUnique({
        where: { uid: userUid },
      });

      if (move.creatorId === user.id) {
        // If the user is the creator of the move, they can delete it
        await prisma.move.delete({
          where: {
            id: id,
          },
        });

        // Optionally, you can handle additional actions here, such as sending a success message.
        return res.status(200).json({ message: "Move deleted successfully" });
      }
    }

    // If the user is not the creator of the move or not found, they don't have permission to delete it.
    return res
      .status(403)
      .json({ message: "You do not have permission to delete this move" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  } finally {
    await prisma.$disconnect();
  }
});
