import { mentors, mentorsBulk } from "../../utils/query.js";
import { dateValue } from "../../utils/tools.cjs";

export const getAll = async (req, res) => {
  try {
    const teams = await mentors(
      `SELECT m.id, m.name, d.name AS departments, m.photo
      FROM mentors m INNER JOIN departments d ON m.departemen_id = d.id;`
    );
    return res.status(200).json(teams);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const validationAddTeams = async (req, res, next) => {
  const { userId, data } = req.body;
  const { mentorId } = req.user;
  let newList = [];

  try {
    if (
      userId === undefined ||
      userId === "" ||
      data === undefined ||
      data.length === 0
    ) {
      return res.status(400).json("Invalid data!");
    }

    const dataLength = data.length;
    for (let i = 0; i < dataLength; i++) {
      const { userId, teamId } = data[i];

      if (userId === undefined || teamId === undefined)
        return res.status(400).json({ message: "Invalid data!" });

      newList.push([userId, teamId, mentorId, dateValue()]);
    }

    req.newTeam = newList;
    next();
  } catch (error) {
    return res.status(400).json(error.message);
  } finally {
    newList = [];
  }
};

export const addTeams = async (req, res) => {
  const { userId } = req.body;
  const listTeam = req.newTeam;
  try {
    const relationsExist = await mentors(
      `SELECT users_id FROM team_relations WHERE users_id = ?;`,
      [userId]
    );

    if (relationsExist.length > 0) {
      await mentors(`DELETE FROM team_relations WHERE users_id = ?`, [userId]);
    }

    const formatQuery = await mentorsBulk(
      `INSERT INTO team_relations (
        users_id, teams_id, created_by, created_at
      ) VALUES ?;`,
      [listTeam]
    );

    await mentors(formatQuery);
    return res.status(200).json({ message: "Added success!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const teams = async (req, res) => {
  const { mentorId } = req.user;
  try {
    const data = await mentors(
      `SELECT 
      m.id, m.name, d.name AS departments, m.photo  
      FROM team_relations AS tr 
      INNER JOIN mentors AS m ON tr.users_id = m.id
      INNER JOIN departments AS d ON m.departemen_id = d.id 
      WHERE tr.users_id = ?;`,
      [mentorId]
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
