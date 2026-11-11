import { promises as fs } from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "lib", "admin-config.json");

export type AdminConfig = {
  user: string;
  password: string;
};

const DEFAULT_USER = process.env.ADMIN_USER ?? "Login Admin";
const DEFAULT_PASS = process.env.ADMIN_PASS ?? "4dmin.1973";

export async function getAdminConfig(): Promise<AdminConfig> {
  try {
    const raw = await fs.readFile(configPath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<AdminConfig>;
    return {
      user: parsed.user || DEFAULT_USER,
      password: parsed.password || DEFAULT_PASS,
    };
  } catch {
    return {
      user: DEFAULT_USER,
      password: DEFAULT_PASS,
    };
  }
}

export async function setAdminConfig(config: AdminConfig): Promise<void> {
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
}
