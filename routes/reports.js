// Based on the Prisma schema you provided, you can use the _count parameter in a findMany or
// findFirst query to count the
// number of Proficiency records associated with a User that have a certain level. Here's an example:

// In this query, we're finding the user
//  and selecting the count of their proficiencies where the level is 'Extreme'.
//  The result will be an object with the count of proficiencies.

// Unfortunately, Prisma does not currently support multiple counts with different conditions in a single query.
const router = require("express").Router();
const { prisma } = require("../utils/connect");
const { verifyToken } = require("../middleware/middleware");

router.get("/test", (req, res) => {
  res.send("report test is successful");
});

// router.get("/learning", verifyToken, async (req, res) => {
//   try {
//     const userUid = req.user; // Obtain user's UID from your authentication mechanism (e.g., Firebase Auth)
//     console.log("User UID (Backend):", userUid);

//     // this part is new for the proficiency
//     let count = 0;
//     if (userUid) {
//       const learningCount = await prisma.user.findFirst({
//         where: {
//           uid: userUid,
//         },
//         include: {
//           proficiencies: {
//             where: { level: "Learning" },
//             select: { id: true }, // select any field, it doesn't matter
//           },
//         },
//       });

//       count = learningCount.proficiencies.length; // get the length of the array

//       console.log("User's Proficiency Count of Learning (Backend):", count);
//     }

//     res.status(200).json({ count });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Something went wrong!" });
//   } finally {
//     await prisma.$disconnect(); // Disconnect from the database after the request
//   }
// });

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
