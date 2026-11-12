import { promises as fs } from "fs";
import path from "path";
import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";
import { lerDadosPersistidos, salvarDadosPersistidos, temBancoConfigurado } from "./database";

const configPath = path.join(process.cwd(), "lib", "admin-config.json");
const KEY_LENGTH = 64;

const scryptAsync = promisify(scryptCallback) as (
  senha: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

export type AdminConfig = {
  user: string;
  /** Hash scrypt ("scrypt:salt:hex") ou senha legada em texto puro. */
  password: string;
};

type ArquivoConfig = {
  user?: string;
  password?: string;
  passwordHash?: string;
};

type AdminPersistido = {
  user: string;
  passwordHash: string;
};

async function hashPassword(senha: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = await scryptAsync(senha, salt, KEY_LENGTH);
  return `scrypt:${salt}:${hash.toString("hex")}`;
}

/** Confere a senha com o hash salvo (aceita senhas antigas em texto puro). */
export async function verifyPassword(
  senha: string,
  senhaSalva: string,
): Promise<boolean> {
  if (!senhaSalva) return false;

  // Compatibilidade com configurações antigas salvas em texto puro.
  if (!senhaSalva.startsWith("scrypt:")) return senha === senhaSalva;

  const [, salt, hashHex] = senhaSalva.split(":");
  if (!salt || !hashHex) return false;

  const hash = await scryptAsync(senha, salt, KEY_LENGTH);
  const esperado = Buffer.from(hashHex, "hex");

  return hash.length === esperado.length && timingSafeEqual(hash, esperado);
}

export async function getAdminConfig(): Promise<AdminConfig> {
  if (temBancoConfigurado()) {
    const persistido = await lerDadosPersistidos<AdminPersistido>("admin");
    if (persistido) {
      return { user: persistido.user, password: persistido.passwordHash };
    }
  }

  let arquivo: ArquivoConfig | null = null;

  try {
    const raw = await fs.readFile(configPath, "utf-8");
    arquivo = JSON.parse(raw) as ArquivoConfig;
  } catch {
    arquivo = null;
  }

  return {
    user: arquivo?.user?.trim() || process.env.ADMIN_USER?.trim() || "",
    password:
      arquivo?.passwordHash || arquivo?.password || process.env.ADMIN_PASS || "",
  };
}

/** Grava a nova senha apenas como hash scrypt, nunca em texto puro. */
export async function setAdminPassword(senha: string): Promise<void> {
  const { user } = await getAdminConfig();
  const passwordHash = await hashPassword(senha);

  if (temBancoConfigurado()) {
    await salvarDadosPersistidos("admin", { user, passwordHash });
    return;
  }

  await fs.writeFile(
    configPath,
    JSON.stringify({ user, passwordHash }, null, 2),
    { encoding: "utf-8", mode: 0o600 },
  );
}
