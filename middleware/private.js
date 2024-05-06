import "dotenv/config";
import passport from "passport";
import passportJWT from "passport-jwt";
import { mentors } from "../utils/query.js";
import privateKey from "../utils/private.js";

const ExtractJWT = passportJWT.ExtractJwt;
const strategyJWT = passportJWT.Strategy;

passport.use(
  "internal-rule",
  new strategyJWT(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: privateKey,
    },
    async (payload, done) => {
      const { id } = payload;
      const [mentor] = await mentors(
        `SELECT id, role_id as roleId FROM mentors WHERE id = ? `,
        [id]
      );

      if (mentor === undefined) return done(null, false);

      const user = {
        mentorId: mentor.id,
        roleId: mentor.roleId,
      };

      done(null, user);
    }
  )
);
