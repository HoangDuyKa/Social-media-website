import express from "express";
import { getSearchs } from "../controllers/search.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getSearchs);
router.post("/", async (req, res) => {
  const query = req.body.query;
  console.log(query);
  try {
    const response = await fetch("http://localhost:5000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      // If the response is not OK, throw an error
      const errorData = await response.json();
      throw new Error(errorData.error || "Error querying the AI model");
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error querying the AI model:", error);
    res.status(500).send("Error querying the AI models");
  }
});

// router.post("/", async (req, res) => {
//   const query = req.body.query;
//   try {
//     const response = await fetch("http://localhost:5000/search", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query }),
//     });

//     const contentType = response.headers.get("content-type");
//     if (contentType && contentType.includes("application/json")) {
//       const data = await response.json();
//       res.status(200).json(data);
//     } else {
//       const text = await response.text();
//       console.error("Unexpected response format:", text);
//       res
//         .status(500)
//         .send("Error querying the AI model: Unexpected response format");
//     }
//   } catch (error) {
//     console.error("Error querying the AI model:", error);
//     res.status(500).send("Error querying the AI model");
//   }
// });

export default router;
