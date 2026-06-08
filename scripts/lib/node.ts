import { access, readFile } from "node:fs/promises";
import process from "node:process";
import { join } from "node:path";
import { normalizeVersion } from "../utils/normalize-version.ts";

interface IGetNodeVersionOptions {
  cwd?: string;
  fallback?: string;
}

const getNodeVersion = async ({
  cwd = process.cwd(),
  fallback = "latest",
}: IGetNodeVersionOptions = {}): Promise<string> => {
  const nvmrcPath = join(cwd, ".nvmrc");

  try {
    await access(nvmrcPath);

    const content = await readFile(nvmrcPath, "utf8");

    const version = normalizeVersion(content);

    if (!version) {
      throw new Error("Empty .nvmrc file", {
        cause: new Error(`.nvmrc file at ${nvmrcPath} is empty`),
      });
    }

    return version;
  } catch {
    return fallback;
  }
};

export { getNodeVersion };
