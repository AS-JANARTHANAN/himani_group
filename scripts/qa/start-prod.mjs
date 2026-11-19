// Starts the production test build (from .next-prod) on port 3200, next to the dev server.
import { spawn } from "node:child_process";
process.env.NEXT_DIST_DIR = ".next-prod";
const p = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", "3200"], { stdio: "inherit", env: process.env });
p.on("exit", (c) => process.exit(c ?? 0));
