import process from "node:process";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { group, info, setFailed } from "@actions/core";
//#region scripts/utils/normalize-version.ts
const normalizeVersion = (value) => value.trim().replace(/^v/, "");
//#endregion
//#region scripts/lib/node.ts
const getNodeVersion = async ({ cwd = process.cwd(), fallback = "latest" } = {}) => {
  const nvmrcPath = join(cwd, ".nvmrc");
  try {
    await access(nvmrcPath);
    const version = normalizeVersion(await readFile(nvmrcPath, "utf8"));
    if (!version)
      throw new Error("Empty .nvmrc file", {
        cause: /* @__PURE__ */ new Error(`.nvmrc file at ${nvmrcPath} is empty`),
      });
    return version;
  } catch {
    return fallback;
  }
};
//#endregion
//#region scripts/utils/get-error-message.ts
const getErrorMessage = (errorValue) =>
  errorValue instanceof Error ? errorValue.message : String(errorValue);
//#endregion
//#region scripts/get-node-version.ts
try {
  const resolvedVersion = await group("Resolving Node.js version", async () => {
    const nodeVersion = await getNodeVersion();
    info(`Detected Node.js version: ${nodeVersion}`);
    return nodeVersion;
  });
  process.stdout.write(resolvedVersion);
} catch (errorValue) {
  setFailed(getErrorMessage(errorValue));
}
//#endregion
export {};
