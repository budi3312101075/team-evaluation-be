import { teamQuery } from "../utils/query.js";
import { dateValue } from "../utils/tools.cjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerTeam = async (req, res) => {
  const {
    code,
    name,
    email,
    phone,
    gender,
    linkedin,
    dapartment_id,
    divisions_id,
    position_id,
    leader_id,
  } = req.body;

  if (
    !code ||
    !name ||
    !email ||
    !phone ||
    !gender ||
    !dapartment_id ||
    !divisions_id ||
    !position_id
  ) {
    return res.status(400).json({ failed: "incomplete data" });
  }
  try {
    // validasi photo
    if (req.file === undefined) {
      return res.status(400).json({ failed: "photo is required" });
    }

    const { filename: photo, size } = req.file;
    if (size > 2000000) {
      return res.status(400).json({ failed: "Photo must be smaller than 2MB" });
    }

    // validasi leader
    const leaderExist = await teamQuery(
      `SELECT id FROM teams WHERE id = ? and is_active = 1`,
      [leader_id]
    );
    if (leaderExist.length === 0) {
      return res.status(400).json({ failed: "leader id not found" });
    }

    // validasi code dan name
    const codeExist = await teamQuery(
      `SELECT code FROM teams WHERE code = ? and is_active = 1`,
      [code]
    );
    const nameExist = await teamQuery(
      `SELECT name FROM teams WHERE name = ? and is_active = 1`,
      [name]
    );
    if (codeExist.length > 0 && nameExist.length > 0) {
      return res.status(400).json({
        failed: "code and name are already used",
      });
    } else if (codeExist.length > 0) {
      return res.status(400).json({
        failed: "code has been used",
      });
    } else if (nameExist.length > 0) {
      return res.status(400).json({
        failed: "name has been used",
      });
    } else {
      const insertQuery = await teamQuery(
        `INSERT INTO teams (code, name, email, phone, gender, linkedin,
         photo, department_id, divisions_id, position_id, created_at, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          code,
          name,
          email,
          phone,
          gender,
          linkedin,
          photo,
          dapartment_id,
          divisions_id,
          position_id,
          dateValue(),
          req.user.id,
        ]
      );
      // insert team leader
      const teamId = insertQuery.insertId;

      await teamQuery(
        `INSERT INTO team_leadership (team_id, leader_id, created_at, created_by) 
         VALUES (?, ?, ?, ?)`,
        [teamId, leader_id, dateValue(), req.user.id]
      );
      return res.status(200).json({ success: "Team successfully created" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password, group_id, team_Id } = req.body;

  if (!name || !email || !password || !group_id) {
    return res.status(400).json({ failed: "incomplete data" });
  }
  try {
    const nameExist = await teamQuery(
      `SELECT name FROM users WHERE name = ? and is_active = 1`,
      [name]
    );
    const emailExist = await teamQuery(
      `SELECT email FROM users WHERE email = ? and is_active = 1`,
      [email]
    );
    const teamExist = await teamQuery(
      `SELECT team_id FROM user_teams WHERE team_id = ?`,
      [team_Id]
    );

    if (nameExist.length > 0 && emailExist.length > 0) {
      return res.status(400).json({
        failed: "name and email are already used",
      });
    } else if (nameExist.length > 0) {
      return res.status(400).json({
        failed: "name has been used",
      });
    } else if (emailExist.length > 0) {
      return res.status(400).json({
        failed: "email has been used",
      });
    } else if (teamExist.length > 0) {
      return res.status(400).json({
        failed: "Team sudah memiliki akun",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const insertQuery = await teamQuery(
        `INSERT INTO users 
      (name, email, password, group_id, created_at, created_by) 
      VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, hashPassword, group_id, dateValue(), req.user.id]
      );
      const userId = insertQuery.insertId;

      if (team_Id) {
        await teamQuery(
          `INSERT INTO user_teams 
          (user_id, team_id, created_at, created_by) 
          VALUES (?, ?, ?, ?)`,
          [userId, team_Id, dateValue(), req.user.id]
        );
      }
      return res.status(200).json({ success: "User successfully created" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await teamQuery(
      `SELECT  id, email, password 
      FROM users WHERE DATE(deleted_at) 
      IS NULL AND is_active = 1 AND email = ?`,
      [email]
    );

    if (userExist.length === 0) {
      return res.status(400).json({ failed: "You are not registered yet" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      userExist[0].password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ failed: "password not match" });
    }

    const dataUser = await teamQuery(
      `SELECT u.id, u.name AS namaAkun, t.code, t.name, t.email,ug.name AS role, 
      t.phone, t.gender, t.linkedin, t.photo, dp.name AS dapartement, 
      d.name AS divisi, p.name AS posisi
      FROM users u LEFT JOIN 
            user_groups ug ON u.group_id = ug.id 
            LEFT JOIN user_teams ut ON u.id = ut.user_id 
            LEFT JOIN teams t ON ut.team_id = t.id
            LEFT JOIN departments dp ON t.department_id = dp.id
            LEFT JOIN divisions d ON t.divisions_id = d.id
            LEFT JOIN positions p ON t.position_id = p.id
            WHERE u.id = ?`,
      [userExist[0].id]
    );

    const data = dataUser[0];
    const token = jwt.sign(
      {
        data,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const options = {
      httpOnly: true,
      maxAge: 3600000 * 1 * 24,
    };

    return res
      .status(200)
      .cookie("token", token, options)
      .json({ success: true, token: token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("token")
      .json({ success: true, msg: "Logout Berhasil!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
