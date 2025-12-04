// Simple Vercel serverless function for handling login without a database.
// It uses the same static users as the current frontend auth logic.

/** @typedef {"student" | "admin"} UserRole */

/**
 * @typedef User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 */

/** @type {User[]} */
const USERS = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "adminhead",
    role: "admin",
  },
  {
    id: "student-1",
    name: "Student User",
    email: "user001",
    role: "student",
  },
];

const PASSWORDS = {
  adminhead: "admin@head",
  user001: "user@001",
};

/**
 * Helper to read and parse JSON body from the request.
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<any>}
 */
async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        const parsed = data ? JSON.parse(data) : {};
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", (err) => reject(err));
  });
}

/**
 * Vercel serverless function handler.
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  try {
    const body = await readJsonBody(req);
    const { email, password, role } = body || {};

    if (!email || !password || !role) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "email, password and role are required" }));
      return;
    }

    const user = USERS.find((u) => u.email === email && u.role === role);
    const expectedPassword = PASSWORDS[email];

    if (!user || expectedPassword !== password) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Invalid credentials" }));
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    );
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};
