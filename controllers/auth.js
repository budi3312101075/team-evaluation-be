import { mentors } from "../utils/query.js";
import privateKey from "../utils/private.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

var MODULEDB = process.env.MODULE_DB;

export const validateLogin = async (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "")
    return res.status(400).json("Invalid input!!");

  try {
    // check by username
    const [checkByUsername] = await mentors(
      `SELECT id, password, 
      is_deleted as isDeleted, 
      is_active as isActive  
      FROM mentors WHERE username = ?`,
      [username]
    );

    // validate if username exists
    if (checkByUsername !== undefined) {
      if (checkByUsername.isDeleted === 1 || checkByUsername.isActive === 0)
        return res.status(400).json("User already disabled!");

      req.employees = checkByUsername;
      return next();
    }

    // check by email
    const [checkByEmail] = await query(
      `
        SELECT id, password, is_deleted as isDeleted, is_active as isActive FROM teams WHERE email = ?
      `,
      [username]
    );

    // check by email
    if (checkByEmail !== undefined) {
      if (checkByEmail.isDeleted === 1 || checkByEmail.isActive === 0)
        return res.status(400).json("User already disabled!");

      req.employees = checkByEmail;
      return next();
    }

    return res.status(400).json("User not exists!");
  } catch (error) {
    return res.status(400).json("Something went wrong!");
  }
};

export const login = async (req, res) => {
  const { password: passInput } = req.body;
  const { id, password } = req.employees;
  try {
    const isMatch = await bcrypt.compare(passInput, password);
    if (!isMatch) return res.status(400).json("Invalid username/password!");

    const getEmployees = await mentors(
      `
        SELECT
          t.id, t.name, t.username,
          m.uuid as moduleId,
          p.can_read as canRead, p.can_create as canCreate, p.can_update as canUpdate, p.can_delete as canDelete
        FROM mentors t
        LEFT JOIN roles r ON t.role_id = r.id
        LEFT JOIN permissions p ON p.role_id = r.id
        LEFT JOIN ${MODULEDB}.modules m ON p.module_id = m.id
        LEFT JOIN ${MODULEDB}.category_module cm ON m.category_id = cm.id
        WHERE t.id = ?
        ORDER BY cm.order ASC, m.order ASC;
      `,
      [id]
    );

    if (getEmployees.length === 0)
      return res.status(400).json("User not exists!");

    const userData = {};
    const listModuleAccess = [];
    const userValue = getEmployees[0];
    userData.id = userValue.id;
    userData.name = userValue.name;
    userData.username = userValue.username;
    userData.listModuleAccess = [];
    for (let i = 0; i < getEmployees.length; i++) {
      listModuleAccess.push({
        moduleId: getEmployees[i].moduleId,
        moduleName: getEmployees[i].moduleName,
        canRead: getEmployees[i].canRead,
        canCreate: getEmployees[i].canCreate,
        canUpdate: getEmployees[i].canUpdate,
        canDelete: getEmployees[i].canDelete,
      });
    }
    userData.listModuleAccess = listModuleAccess;

    return jwt.sign(
      userData,
      privateKey,
      {
        expiresIn: "2 days",
      },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({
          Authorization: `bearer ${token}`,
        });
      }
    );
  } catch (error) {
    return res.status(400).json({ "Something went wrong!": error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { employeeId } = req.user;
  const { prevPassword, password, confirmPassword } = req.body;
  if (
    prevPassword === "" ||
    prevPassword === undefined ||
    password === "" ||
    password === undefined ||
    confirmPassword === "" ||
    confirmPassword === undefined
  )
    return res.status(400).json("Invalid data!");

  if (password !== confirmPassword)
    return res.status(400).json("Password or Confirm password not match!");

  try {
    const [isExists] = await mentors(
      `
        SELECT password FROM mentors WHERE id = ?
      `,
      [employeeId]
    );

    if (isExists === undefined) return res.status(400).json("Invalid data!");

    const isMatch = await bcrypt.compare(prevPassword, isExists.password);

    if (!isMatch) return res.status(400).json("Password not match!");

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    await mentors(
      `
        UPDATE mentors SET 
        password = ?
        WHERE id = ?;
      `,
      [hash, employeeId]
    );

    return res.status(200).json("Password update success!");
  } catch (error) {
    return res.status(400).json("Something went wrong!");
  }
};
