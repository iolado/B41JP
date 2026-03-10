import bcrypt from "bcrypt";

import db from "#db/client";

const SALT_ROUNDS = 10;

export async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const sql = `
  INSERT INTO users
    (username, password)
  VALUES
    ($1, $2)
  RETURNING id, username
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function createUserWithPassword(username, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const sql = `
  INSERT INTO users
    (username, password)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function getUserById(id) {
  const sql = `
  SELECT id, username
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}

export async function getUserByUsername(username) {
  const sql = `
  SELECT *
  FROM users
  WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  return user;
}

export async function getUserByCredentials(username, password) {
  const user = await getUserByUsername(username);
  if (!user) return null;

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) return null;

  return {
    id: user.id,
    username: user.username,
  };
}
