import { exec } from "child_process";
import { spawn } from "child_process";
import path from "path";

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
 * Pull repo and check for backend changes
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

    const backendChanged = diff
      .split("\n")
      .some(file => file.startsWith("backend/"));

    if (backendChanged) {
      console.log("[watcher] Backend changes detected.");
      await restartGoServer();
    } else {
      console.log("[watcher] Changes detected, but not backend-related.");
    }
  } catch (err) {
    console.error("[watcher] Update check failed.");
  }
}

/**
 * Graceful shutdown (Pterodactyl stop / Ctrl+C)
 */
process.on("SIGTERM", () => {
  console.log("[watcher] Shutting down...");
  if (goProcess) goProcess.kill("SIGTERM");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("[watcher] Interrupted.");
  if (goProcess) goProcess.kill("SIGTERM");
  process.exit(0);
});

/**
 * Initial start + poll every minute
 */
(async () => {
  console.log("[watcher] Initial startup...");
  await restartGoServer();
  setInterval(checkForUpdates, 60 * 1000);
})();
