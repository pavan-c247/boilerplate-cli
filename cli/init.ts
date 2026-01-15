import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import prompts from "prompts";
import os from "node:os";
import crypto from "node:crypto";
import { exec } from "node:child_process";
import util from "node:util";
import { BOILERPLATE_REPO, BOILERPLATE_BRANCH } from "./constants.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const CLI_ROOT = path.resolve();
// dist/cli → project root - for build
const CLI_ROOT = path.resolve(__dirname, "..", "..");
const TEMPLATE_DIR = path.join(CLI_ROOT, "templates/base");
const META_FILE = path.join(CLI_ROOT, "templates/meta/modules.json");
const MANIFEST_FILE = path.join(TEMPLATE_DIR, "modules.manifest.json");

interface ModuleChoice {
  title: string;
  value: string;
  description?: string;
  default?: boolean;
}

type TemplateSource = "local" | "github";

const execAsync = util.promisify(exec);

// Generate a unique temporary directory
function getTempDir() {
  return path.join(
    os.tmpdir(),
    `frontend-theme-${crypto.randomUUID()}`
  );
}

// Get manifest file path in target directory
function getManifestFile(targetDir: string) {
  return path.join(targetDir, "modules.manifest.json");
}

// Prompt for template source
async function selectTemplateSource(): Promise<TemplateSource> {
  const response = await prompts({
    type: "select",
    name: "source",
    message: "Select boilerplate source:",
    choices: [
      { title: "GitHub (latest dev branch)", value: "github" },
      { title: "Local template (bundled)", value: "local" }
    ],
    initial: 0
  });

  return response.source ?? "github";
}

// Clone boilerplate from GitHub
async function cloneFromGitHub(tempDir: string) {
  console.log("Cloning boilerplate from GitHub...");

  await execAsync(
    `git clone --depth=1 --branch ${BOILERPLATE_BRANCH} ${BOILERPLATE_REPO} "${tempDir}"`
  );

  // Remove git history
  await fs.remove(path.join(tempDir, ".git"));

  console.log("Boilerplate cloned successfully");
}

// Prompt for project name
async function getProjectName(): Promise<string | null> {
  const response = await prompts({
    type: "text",
    name: "projectName",
    message: "Project name:",
    validate: (value: string) =>
      value.trim().length > 0 ? true : "Project name cannot be empty",
  });

  return response.projectName || null;
}

// Prompt for modules
async function selectModules(): Promise<string[] | null> {
  const meta = await fs.readJson(META_FILE);
  const choices: ModuleChoice[] = Object.entries(meta.modules).map(([key, val]: any) => ({
    title: val.label,
    value: key,
    description: val.description,
    selected: val.default || false,
  }));

  while (true) {
    const response = await prompts({
      type: "multiselect",
      name: "modules",
      message: "Select modules to include (at least one required):",
      choices,
      instructions: true,
      hint: "- Space to select. Return to submit"
    });

    // Check if user cancelled (CTRL+C or ESC)
    if (response.modules === undefined) {
      return null;
    }

    // Check if at least one module is selected
    if (response.modules.length === 0) {
      console.log("You must select at least one module. Please try again.\n");
      continue;
    }

    return response.modules;
  }
}

// Copy base template
async function copyBase(
  targetDir: string,
  source: TemplateSource
) {
  console.log("Preparing boilerplate...");

  if (source === "local") {
    await fs.copy(TEMPLATE_DIR, targetDir, { overwrite: true });
    console.log("Boilerplate copied from local template");
    return;
  }

  const tempDir = getTempDir();

  try {
    await cloneFromGitHub(tempDir);
    await fs.copy(tempDir, targetDir, { overwrite: true });
  } finally {
    await fs.remove(tempDir);
  }
}

// Prune unselected modules
async function pruneModules(
  targetDir: string,
  selectedModules: string[]
) {
  const manifestFile = getManifestFile(targetDir);
  const manifest = await fs.readJson(manifestFile);

  const allModules = Object.keys(manifest.modules);

  for (const moduleName of allModules) {
    if (!selectedModules.includes(moduleName)) {
      for (const p of manifest.modules[moduleName].paths) {
        const fullPath = path.join(targetDir, p);
        if (await fs.pathExists(fullPath)) {
          await fs.remove(fullPath);
          console.log(`Removed unselected module path: ${p}`);
        }
      }
    }
  }
}

// Write enabled modules config
async function writeEnabledModulesConfig(
  targetDir: string,
  selectedModules: string[]
) {
  const configDir = path.join(targetDir, "src/config");
  const configFile = path.join(configDir, "enabled-modules.json");

  await fs.ensureDir(configDir);

  await fs.writeJson(
    configFile,
    {
      mode: "selective",
      modules: selectedModules
    },
    { spaces: 2 }
  );

  console.log("Generated src/config/enabled-modules.json");
}

// Cleanup function to remove created directory
async function cleanup(targetDir: string) {
  try {
    if (await fs.pathExists(targetDir)) {
      await fs.remove(targetDir);
      console.log(`Cleaned up: Removed directory "${path.basename(targetDir)}"`);
    }
  } catch (cleanupError) {
    console.error(`Failed to cleanup directory: ${cleanupError}`);
  }
}

// init function
export async function init() {
  const projectName = await getProjectName();
  if (!projectName) {
    console.log("Project creation cancelled");
    return;
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  if (await fs.pathExists(targetDir)) {
    console.log(`Directory "${projectName}" already exists`);
    return;
  }

  console.log("Creating project...");

  let dirCreated = false;

  try {
    // 1️⃣ Create the target directory
    await fs.ensureDir(targetDir);
    dirCreated = true;

    // 2️⃣ Select template source (local vs GitHub)  ✅ NEW
    const source = await selectTemplateSource();

    // 3️⃣ Copy boilerplate from selected source  🔁 MODIFIED
    await copyBase(targetDir, source);

    // 4️⃣ Select modules
    const selectedModules = await selectModules();

    // Handle user cancellation
    if (selectedModules === null) {
      console.log("\nProject creation cancelled");
      await cleanup(targetDir);
      process.exit(0);
    }

    // 5️⃣ Prune unselected modules
    console.log("Selected modules:", selectedModules);
    await pruneModules(targetDir, selectedModules);

    // 6️⃣ Write enabled-modules.json
    await writeEnabledModulesConfig(targetDir, selectedModules);

    // 7️⃣ Success message
    console.log(`Project "${projectName}" created successfully`);
    console.log(`cd ${projectName} && yarn install && yarn dev`);
  } catch (error) {
    console.error("Error during project creation:", error);

    // Rollback if something failed
    if (dirCreated) {
      await cleanup(targetDir);
    }

    console.log("Project creation failed and changes have been reverted");
    process.exit(1);
  }
}
