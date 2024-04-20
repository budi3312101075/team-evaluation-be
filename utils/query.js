import { teamDB, managementDB } from "../config/index.js";

export const teamQuery = async (query, array) => {
  const [value] = await teamDB.query(query, array === undefined ? [] : array);
  return value;
};

export const teamBulk = async (query, array) => {
  return await teamDB.format(query, array === undefined ? [] : array);
};

export const managementQuery = async (query, array) => {
  const [value] = await managementDB.query(
    query,
    array === undefined ? [] : array
  );
  return value;
};

export const managementBulk = async (query, array) => {
  return await managementDB.format(query, array === undefined ? [] : array);
};
