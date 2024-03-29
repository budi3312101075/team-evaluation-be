import query from "../config/db";

export const registerTeam = async (req, res) => {
  const {
    code,
    name,
    email,
    phone,
    gender,
    linkedin,
    photo,
    dapartment_id,
    position_id,
  } = req.body;
  try {
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
