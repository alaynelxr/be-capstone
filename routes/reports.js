const router = require("express").Router();
const { prisma } = require("../utils/connect");
const { verifyToken } = require("../middleware/middleware");

router.get("/test", (req, res) => {
  res.send("report test is successful");
});

router.get("/learning", verifyToken, async (req, res) => {
  try {
    const userUid = req.user; // Obtain user's UID from your authentication mechanism (e.g., Firebase Auth)
    console.log("User UID (Backend):", userUid);

    let learningCount = 0;
    let expertCount = 0;
    let competentCount = 0;

    if (userUid) {
      const user = await prisma.user.findFirst({
        where: {
          uid: userUid,
        },
        include: {
          proficiencies: true,
        },
      });

      learningCount = user.proficiencies.filter(
        (prof) => prof.level === "Learning"
      ).length;
      expertCount = user.proficiencies.filter(
        (prof) => prof.level === "Expert"
      ).length;
      competentCount = user.proficiencies.filter(
        (prof) => prof.level === "Competent"
      ).length;

      console.log(
        "User's Proficiency Count of Learning (Backend):",
        learningCount
      );
      console.log("User's Proficiency Count of Expert (Backend):", expertCount);
      console.log(
        "User's Proficiency Count of Competent (Backend):",
        competentCount
      );
    }

    res.status(200).json({ learningCount, expertCount, competentCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  } finally {
    await prisma.$disconnect(); // Disconnect from the database after the request
  }
});

module.exports = router;
