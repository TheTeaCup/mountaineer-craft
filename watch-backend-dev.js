import { exec } from "child_process";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const WATCHER_FILE = path.basename(__filename);

const REPO_DIR = process.cwd();
const BACKEND_DIR = path.join(REPO_DIR, "backend");

let goProcess = null;

/**
 * Run a shell command and return stdout
 */
function run(cmd, cwd = REPO_DIR) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (err, stdout, stderr) => {
      if (err) {
        console.error(`[error] ${stderr || err.message}`);
        return reject(err);
      }
      resolve(stdout.trim());
    });
  });
}

/**
 * Stop + start Go server using go run .
 */
async function restartGoServer() {
  if (goProcess) {
    console.log("[watcher] Stopping Go server...");
    goProcess.kill("SIGTERM");
  }

  console.log("[watcher] Downloading Go modules...");
  await run("go mod download", BACKEND_DIR);

  console.log("[watcher] Starting Go server (go run .)...");
  goProcess = spawn("go", ["run", "."], {
    cwd: BACKEND_DIR,
    stdio: "inherit"
  });
}

/**
 * Pull repo and react to changes
 */
async function checkForUpdates() {
  try {
    //console.log(`[watcher] Checking for updates (${new Date().toISOString()})`);

    const oldCommit = await run("git rev-parse HEAD");
    await run("git pull origin main");
    const newCommit = await run("git rev-parse HEAD");

    if (oldCommit === newCommit) {
      //console.log("[watcher] No changes.");
      return;
    }

    const diff = await run(
      `git diff --name-only ${oldCommit} ${newCommit}`
    );

    const files = diff.split("\n").filter(Boolean);

    const watcherChanged = files.some(
      file => path.basename(file) === WATCHER_FILE
    );

    const backendChanged = files.some(
      file => file.startsWith("backend/")
    );

    if (watcherChanged) {
      console.log("[watcher] Watcher updated. Restarting container...");

      if (goProcess) goProcess.kill("SIGTERM");
      process.exit(0); // Pterodactyl will restart us
    }

    if (backendChanged) {
      console.log("[watcher] Backend changes detected.");
      await restartGoServer();
    } else {
      console.log("[watcher] Changes detected, but not backend-related.");
    }
  } catch {
    console.error("[watcher] Update check failed.");
  }
}

/**
 * Graceful shutdown (Pterodactyl stop / Ctrl+C)
 */
function shutdown() {
  console.log("[watcher] Shutting down...");
  if (goProcess) goProcess.kill("SIGTERM");
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

/**
 * Initial start + poll every minute
 */
(async () => {
  console.log("[watcher] Initial startup...");
  await restartGoServer();
  setInterval(checkForUpdates, 60 * 1000);
})();
