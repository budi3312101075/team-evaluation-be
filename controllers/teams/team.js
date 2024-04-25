import { mentors, evaluation } from "../../utils/query.js";

export const getTeams = async (req, res) => {
  const employeeId = req.user.employeeId;
  const divisiId = req.user.divisionsId;
  try {
    const cekLeaders = await evaluation(
      `SELECT leader_id FROM 
      team_leadership WHERE 
      team_id = ? AND is_deleted = 0;`,
      [employeeId]
    );

    if (cekLeaders.length === 0) {
      const teams = await mentors(
        `SELECT id, name, photo FROM 
      mentors WHERE 
      divisions_id = ? AND id != ? AND 
      is_active = 1 AND is_deleted = 0;`,
        [divisiId, employeeId]
      );

      return res.status(200).json({ leaders: "has no leader", teams: teams });
    }

    const leaderId = cekLeaders[0].leader_id;

    const getLeaders = await mentors(
      `SELECT id, name, photo FROM
      mentors WHERE id = ? AND is_active = 1 
      AND is_deleted = 0 ;`,
      [leaderId]
    );

    const teams = await mentors(
      `SELECT id, name, photo
      FROM mentors WHERE divisions_id = ?
      AND id != ? AND is_active = 1 AND is_deleted = 0;`,
      [divisiId, employeeId]
    );

    return res.status(200).json({ leaders: getLeaders, teams: teams });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
