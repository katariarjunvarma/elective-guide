export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  isBlocked?: boolean;
  blockReason?: string;
}

export interface PendingUserRegistration {
  id: string;
  name: string;
  registrationNumber: string;
  email: string;
  username: string;
  passwordHash: string;
  university: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const STORAGE_KEY_USERS = "ers_users";
const STORAGE_KEY_SESSION = "ers_session";
const STORAGE_KEY_PENDING_USERS = "ers_pending_users";

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}

function loadUsers(): User[] {
  const raw = localStorage.getItem(STORAGE_KEY_USERS);
  if (raw) return JSON.parse(raw) as User[];

  const seedUsers: User[] = [
    {
      id: "admin-1",
      name: "Admin User",
      email: "adminhead@example.com",
      username: "adminhead",
      passwordHash: simpleHash("admin@head"),
      role: "admin",
      isBlocked: false,
    },
    {
      id: "student-1",
      name: "Student User",
      email: "user001@example.com",
      username: "user001",
      passwordHash: simpleHash("user@001"),
      role: "student",
      isBlocked: false,
    },
  ];

  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(seedUsers));
  return seedUsers;
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

function loadPendingUsers(): PendingUserRegistration[] {
  const raw = localStorage.getItem(STORAGE_KEY_PENDING_USERS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as PendingUserRegistration[];
  } catch {
    return [];
  }
}

function savePendingUsers(users: PendingUserRegistration[]) {
  localStorage.setItem(STORAGE_KEY_PENDING_USERS, JSON.stringify(users));
}

export interface Session {
  userId: string;
  role: UserRole;
}

export function getCurrentSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY_SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function setSession(session: Session | null) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    return;
  }
  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
}

export function login(email: string, password: string, role: UserRole): User | null {
  const users = loadUsers();
  const cleanedEmail = email.trim();
  const cleanedPasswordHash = simpleHash(password.trim());
  const user = users.find(
    (u) =>
      (u.username === cleanedEmail || u.email === cleanedEmail) &&
      u.passwordHash === cleanedPasswordHash &&
      !u.isBlocked
  );
  if (!user) return null;
  setSession({ userId: user.id, role: user.role });
  return user;
}

export function logout() {
  setSession(null);
}

export function getCurrentUser(): User | null {
  const session = getCurrentSession();
  if (!session) return null;
  const users = loadUsers();
  return users.find((u) => u.id === session.userId) ?? null;
}

export function listStudents(): User[] {
  const users = loadUsers();
  return users.filter((u) => u.role === "student");
}

export function createStudent(input: Omit<User, "id" | "passwordHash" | "role" | "isBlocked"> & { temporaryPassword: string }): User {
  const users = loadUsers();
  const id = `student-${Date.now()}`;
  const newUser: User = {
    id,
    name: input.name,
    email: input.email,
    username: input.username ?? input.email,
    passwordHash: simpleHash(input.temporaryPassword),
    role: "student",
    isBlocked: false,
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUser(
  id: string,
  updates: Partial<Pick<User, "name" | "email" | "passwordHash" | "isBlocked" | "blockReason">>
): User | null {
  const users = loadUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  const updated: User = { ...users[index], ...updates };
  users[index] = updated;
  saveUsers(users);
  return updated;
}

export function deleteUser(id: string) {
  const users = loadUsers().filter((u) => u.id !== id);
  saveUsers(users);
}

export function createPendingUserRegistration(input: {
  name: string;
  registrationNumber: string;
  email: string;
  username: string;
  password: string;
  university: string;
}): PendingUserRegistration {
  const pending = loadPendingUsers();
  const id = `pending-${Date.now()}`;
  const record: PendingUserRegistration = {
    id,
    name: input.name,
    registrationNumber: input.registrationNumber,
    email: input.email,
    username: input.username,
    passwordHash: simpleHash(input.password),
    university: input.university,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  pending.push(record);
  savePendingUsers(pending);
  return record;
}

export function listPendingUserRegistrations(): PendingUserRegistration[] {
  return loadPendingUsers();
}

export function approvePendingUserRegistration(id: string): User | null {
  const pending = loadPendingUsers();
  const index = pending.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const record = pending[index];

  const users = loadUsers();
  const newUser: User = {
    id: `student-${Date.now()}`,
    name: record.name,
    email: record.email,
    username: record.username,
    passwordHash: record.passwordHash,
    role: "student",
    isBlocked: false,
  };

  users.push(newUser);
  saveUsers(users);

  pending.splice(index, 1);
  savePendingUsers(pending);

  return newUser;
}

export function rejectPendingUserRegistration(id: string) {
  const pending = loadPendingUsers().filter((p) => p.id !== id);
  savePendingUsers(pending);
}

export function blockStudentUser(id: string, reason: string) {
  updateUser(id, { isBlocked: true, blockReason: reason });
}

export function unblockStudentUser(id: string) {
  updateUser(id, { isBlocked: false, blockReason: undefined });
}

export function adminResetStudentPassword(id: string, newPassword: string): User | null {
  const passwordHash = simpleHash(newPassword);
  return updateUser(id, { passwordHash });
}

export function adminUpdateStudentUsername(id: string, newUsername: string): User | null {
  const users = loadUsers();
  const cleaned = newUsername.trim();
  if (!cleaned) return null;
  if (users.some((u) => u.username === cleaned && u.id !== id)) {
    return null;
  }
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  const updated: User = { ...users[index], username: cleaned };
  users[index] = updated;
  saveUsers(users);
  return updated;
}
