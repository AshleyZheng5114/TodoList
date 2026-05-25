const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
const authenticationToken = require("../middleware/auth");
const User = require("../models/User");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.redirect(
      `${process.env.FRONTEND_URL}/auth-callback?token=${token}&userId=${user._id}`,
    );
  },
);

// router.get(
//   "/github",
//   passport.authenticate("github", { scope: ["user:email"] }),
// );

// router.get(
//   "/github/callback",
//   passport.authenticate("github", { failureRedirect: "/login" }), // 👈 修复了参数层级
//   (req, res) => {
//     const user = req.user;
//     const token = jwt.sign(
//       {
//         userId: user._id,
//         email: user.email,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" },
//     );

//     res.redirect(
//       `${process.env.FRONTEND_URL}/auth-callback?token=${token}&userId=${user._id}`,
//     );
//   },
// );

router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

router.get("/me", authenticationToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
