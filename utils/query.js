import { evaluationDB, mentorsDB, managementDB } from "../config/index.js";

export const evaluation = async (query, array) => {
  const [value] = await evaluationDB.query(
    query,
    array === undefined ? [] : array
  );
  return value;
};

export const evaluationBulk = async (query, array) => {
  return await evaluationDB.format(query, array === undefined ? [] : array);
};

export const mentors = async (query, array) => {
  const [value] = await mentorsDB.query(
    query,
    array === undefined ? [] : array
  );
  return value;
};

export const mentorsBulk = async (query, array) => {
  return await mentorsDB.format(query, array === undefined ? [] : array);
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
