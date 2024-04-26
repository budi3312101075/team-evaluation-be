import { mentors, mentorsBulk } from "../../utils/query.js";
import { dateValue, uuid } from "../../utils/tools.cjs";

export const getAll = async (req, res) => {
  try {
    const teams = await mentors(
      `SELECT m.id, m.name, d.name AS divisions, m.photo
    FROM mentors m INNER JOIN divisions d ON m.divisions_id = d.id;
    `
    );
    return res.status(200).json({ data: teams });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const validationAddTeams = async (req, res, next) => {
  const { data } = req.body;
  let newList = [];

  try {
    if ((data === undefined, data.length === 0)) {
      return res.status(400).json("Invalid data!");
    }

    const dataLength = data.length;
    for (let i = 0; i < dataLength; i++) {
      const {
        mentorsId,
        teamsId,
        is_deleted = 0,
        created_by = req.user.employeeId,
        created_at = dateValue(),
      } = data[i];

      newList.push([
        uuid(),
        mentorsId,
        teamsId,
        is_deleted,
        created_by,
        created_at,
      ]);
    }

    req.body.data = newList;
    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const addTeams = async (req, res) => {
  const { mentorsId, data } = req.body;

  try {
    if (mentorsId == undefined || mentorsId === "") {
      return res.status(400).json("Invalid data!");
    }

    const relationsExist = await mentors(
      `SELECT id FROM team_relations WHERE mentors_Id = ? AND is_deleted = 0;`,
      [mentorsId]
    );
    if (relationsExist.length > 0) {
      await mentors(`DELETE FROM team_relations WHERE mentors_Id = ?`, [
        mentorsId,
      ]);
    }

    const formatQuery = await mentorsBulk(
      `INSERT INTO team_relations 
      ( id, mentors_id, teams_id, is_deleted, created_by, created_at) VALUES ?;`,
      [data]
    );

    await mentors(formatQuery);
    return res.status(200).json({ message: "Added success!" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const teams = async (req, res) => {
  const employeeId = req.user.employeeId;
  try {
    const teams = await mentors(
      `SELECT m.id, m.name, d.name AS divisions, m.photo  
      FROM team_relations AS tr 
      INNER JOIN mentors AS m ON tr.teams_id = m.id
      INNER JOIN divisions AS d ON m.divisions_id = d.id 
      WHERE tr.mentors_id = ?;`,
      [employeeId]
    );
    return res.status(200).json({ data: teams });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
