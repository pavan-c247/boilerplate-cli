#!/usr/bin/env node

import { init } from "./init.js";

init().catch((err) => {
  console.error("❌ CLI failed:", err);
  process.exit(1);
});
