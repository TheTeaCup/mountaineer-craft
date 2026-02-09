import { exec } from "child_process";
import path from "path";

const REPO_DIR = process.cwd();
const BACKEND_DIR = path.join(REPO_DIR, "backend");

let goProcess = null;
let lastCommit = null;

function run(cmd, cwd = REPO_DIR) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
        return reject(err);
      }
      resolve(stdout.trim());
    });
  });
}

async function hasBackendChanges(oldCommit, newCommit) {
  if (!oldCommit) return true;

  const diff = await run(
    `git diff --name-only ${oldCommit} ${newCommit}`
  );

  return diff
    .split("\n")
    .some(file => file.startsWith("backend/"));
}

async function restartGoServer() {
  if (goProcess) {
    console.log("Stopping Go server...");
    goProcess.kill("SIGTERM");
  }

  console.log("Downloading Go modules...");
  await run("go mod download", BACKEND_DIR);

  console.log("Starting Go server...");
  goProcess = exec("go run .", { cwd: BACKEND_DIR });

  goProcess.stdout.on("data", data => {
    process.stdout.write(`[go] ${data}`);
  });

  goProcess.stderr.on("data", data => {
    process.stderr.write(`[go] ${data}`);
  });
}

async function checkForUpdates() {
  try {
    console.log("Checking for updates...");
    const oldCommit = await run("git rev-parse HEAD");

    await run("git pull origin main");

    const newCommit = await run("git rev-parse HEAD");

    const backendChanged = await hasBackendChanges(oldCommit, newCommit);

    if (backendChanged && oldCommit !== newCommit) {
      console.log("Backend changes detected.");
      await restartGoServer();
    }

    lastCommit = newCommit;
  } catch (err) {
    console.error("Update check failed:", err.message);
  }
}

// initial start
restartGoServer();

// run every minute
setInterval(checkForUpdates, 60 * 1000);
