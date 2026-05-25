const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

// Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          displayName: profile.displayName,
          avatar: profile.photos[0]?.value || null,
        });

        await user.save();
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

// GitHub OAuth
// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: process.env.GITHUB_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ githubId: profile.id });

//         if (user) {
//           return done(null, user);
//         }

//         user = new User({
//           githubId: profile.id,
//           email:
//             profile.emails && profile.emails[0]
//               ? profile.emails[0].value
//               : `${profile.username}@github.com`, // Fallback email if not provided
//           displayName: profile.displayName || profile.username, // Fallback to username if displayName is not provided
//           avatar: profile.photos[0]?.value || null,
//         });

//         await user.save();
//         done(null, user);
//       } catch (error) {
//         done(error, null);
//       }
//     },
//   ),
// );

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
