export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

const STORAGE_KEY_USERS = "ers_users";
const STORAGE_KEY_SESSION = "ers_session";

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
      email: "adminhead",
      passwordHash: simpleHash("admin@head"),
      role: "admin",
    },
    {
      id: "student-1",
      name: "Student User",
      email: "user001",
      passwordHash: simpleHash("user@001"),
      role: "student",
    },
  ];

  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(seedUsers));
  return seedUsers;
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
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

export async function login(email: string, password: string, role: UserRole): Promise<User | null> {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { user?: { id: string; name: string; email: string; role: UserRole } };
    if (!data.user) return null;

    const user: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      passwordHash: "", // password hash is not exposed by the backend
      role: data.user.role,
    };

    setSession({ userId: user.id, role: user.role });
    return user;
  } catch {
    return null;
  }
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

export function createStudent(input: Omit<User, "id" | "passwordHash" | "role"> & { temporaryPassword: string }): User {
  const users = loadUsers();
  const id = `student-${Date.now()}`;
  const newUser: User = {
    id,
    name: input.name,
    email: input.email,
    passwordHash: simpleHash(input.temporaryPassword),
    role: "student",
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUser(id: string, updates: Partial<Pick<User, "name" | "email" | "passwordHash">>): User | null {
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
