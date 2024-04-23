import { evaluation } from "../../utils/query.js";
import { uuid, dateValue } from "../../utils/tools.cjs";

export const created = async (req, res) => {
  const employeeId = req.user.employeeId;
  const { teamId, leaderId } = req.body;
  try {
    if (!teamId || !leaderId) {
      return res.status(400).json({ failed: "incomplete data" });
    }
    const teamExist = await evaluation(
      `SELECT team_id FROM team_leadership WHERE team_id = ? and is_deleted = 0`,
      [teamId]
    );
    if (teamExist.length > 0) {
      return res.status(400).json({
        failed: "The team already has a leader",
      });
    }

    const id = uuid();

    await evaluation(
      `INSERT INTO team_leadership (
        id, team_id, leader_id, created_at, created_by) VALUES 
        (?, ?, ?, ?, ?)`,
      [id, teamId, leaderId, dateValue(), employeeId]
    );

    return res.status(200).json({ message: "Added success!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  const id = req.params.id;
  const employeeId = req.user.employeeId;
  const { leaderId } = req.body;
  try {
    const findLeader = await evaluation(
      `SELECT id FROM team_leadership WHERE id = ? and is_deleted = 0`,
      [id]
    );

    if (findLeader.length === 0) {
      return res.status(400).json({ failed: "Leader not found" });
    }

    await evaluation(
      `UPDATE team_leadership SET 
      leader_id = ?, 
      updated_at = ?, 
      updated_by = ? 
      WHERE id = ?`,
      [leaderId, dateValue(), employeeId, id]
    );

    return res.status(200).json({ message: "Update success!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleted = async (req, res) => {
  const id = req.params.id;
  const employeeId = req.user.employeeId;
  try {
    const findLeader = await evaluation(
      `SELECT id FROM team_leadership WHERE id = ? and is_deleted = 0`,
      [id]
    );

    if (findLeader.length === 0) {
      return res.status(400).json({ failed: "Leader not found" });
    }

    await evaluation(
      `UPDATE team_leadership SET 
      is_deleted = ?, 
      updated_by = ?, 
      updated_at = ? 
      WHERE id = ?`,
      [1, employeeId, dateValue(), id]
    );
    return res.status(200).json({ message: "Delete success!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
