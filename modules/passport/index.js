const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const pool = require("../../config-db");
const bcrypt = require("bcrypt");

const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const FacebookTokenStrategy = require("passport-facebook-token");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  "normal_login",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: false },
    async function (email, password, done) {
      await pool
        .query(
          'SELECT id,first_name,last_name,email,password,avatar,student_id,role,status FROM "user" WHERE email=$1',
          [email]
        )
        .then(async (result) => {
          if (result.rows.length !== 0) {
            const tempPass = cache.get(email);
            if (result.rows[0].status === "Locked")
              return done(null, false, {
                message: "Account has been deactivated.",
              });

            const validPassword = await bcrypt.compare(password, result.rows[0].password);
            if (validPassword || (tempPass && tempPass === password)) {
              if (tempPass) {
                const salt = await bcrypt.genSalt(10);
                const hashPasword = await bcrypt.hash(tempPass, salt);
                await pool.query('UPDATE "user" SET password=$1 WHERE email=$2', [
                  hashPasword,
                  email,
                ]);
              }
              const user = {
                id: result.rows[0].id,
                first_name: result.rows[0].first_name,
                last_name: result.rows[0].last_name,
                email: result.rows[0].email,
                avatar: result.rows[0].avatar,
                student_id: result.rows[0].student_id,
                role: result.rows[0].role,
              };
              return done(null, user);
            }
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          } else {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

passport.use(
  "facebook-token",
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      profileFields: ["id", "email", "name", "gender", "picture"],
      fbGraphVersion: "v12.0",
    },
    function (accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ facebookId: profile.id }, function (error, user) {
      //   return done(error, user);
      // });
      return done(null, profile);
    }
  )
);

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET_KEY;
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    if (jwt_payload.id_provider) {
      await pool
        .query('SELECT id,status FROM "user" WHERE provider_id_fb=$1 or provider_id_gg=$2', [
          jwt_payload.id_provider,
          jwt_payload.id_provider,
        ])
        .then((result) => {
          if (result.rows.length !== 0) {
            if (result.rows[0].status === "Locked") {
              return done(null, false, {
                message: "Account has been deactivated!",
              });
            }
            return done(null, result.rows[0]);
          } else {
            return done(null, false, {
              message: "Invalid token!",
            });
          }
        })
        .catch((err) => {
          return done(err);
        });
    } else {
      await pool
        .query('SELECT id,role,status FROM "user" WHERE id=$1', [jwt_payload.id])
        .then((result) => {
          if (result.rows.length !== 0) {
            if (result.rows[0].status === "Locked")
              return done(null, false, {
                message: "Invalid token!",
              });
            return done(null, result.rows[0]);
          } else {
            return done(null, false, {
              message: "Invalid token!",
            });
          }
        })
        .catch((err) => {
          return done(err);
        });
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: "780592097647-hif1svldddrkc4jpojqc44paile3l8da.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000",
    },
    function (token, tokenSecret, profile, done) {
      console.log(token);
      console.log(tokenSecret);
      console.log();
      return done(null, {});
    }
  )
);
module.exports = passport;
