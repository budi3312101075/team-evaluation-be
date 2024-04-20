import "dotenv/config";
import passport from "passport";
import passportJWT from "passport-jwt";
import { managementQuery } from "../utils/query.js";
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
      const [employee] = await managementQuery(
        `SELECT id, role_id as roleId FROM teams WHERE id = ? `,
        [id]
      );

      if (employee === undefined) return done(null, false);

      const user = {
        employeeId: employee.id,
        roleId: employee.roleId,
      };

      done(null, user);
    }
  )
);
