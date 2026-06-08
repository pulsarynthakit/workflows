import process from "node:process";
import { getNodeVersion } from "./lib/node.ts";
import { group, info, setFailed } from "@actions/core";
import { getErrorMessage } from "./utils/get-error-message.ts";

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
