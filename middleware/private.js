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
      const [employee] = await mentors(
        `SELECT id, role_id as roleId, divisions_id as divisionsId FROM mentors WHERE id = ? `,
        [id]
      );

      if (employee === undefined) return done(null, false);

      const user = {
        employeeId: employee.id,
        divisionsId: employee.divisionsId,
        roleId: employee.roleId,
      };

      done(null, user);
    }
  )
);
