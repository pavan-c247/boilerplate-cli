import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import prompts from "prompts";

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
async function copyBase(targetDir: string) {
  console.log("Copying template files...");

  // Copy everything from TEMPLATE_DIR into targetDir
  await fs.copy(TEMPLATE_DIR, targetDir, { overwrite: true });

  console.log("Template copied successfully");
}

// Prune unselected modules
async function pruneModules(targetDir: string, selectedModules: string[]) {
  const manifest = await fs.readJson(MANIFEST_FILE);
  const allModules = Object.keys(manifest.modules);

  for (const moduleName of allModules) {
    if (!selectedModules.includes(moduleName)) {
      const paths = manifest.modules[moduleName].paths;
      for (const p of paths) {
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
  if (!projectName) return console.log("Project creation cancelled");

  const targetDir = path.resolve(process.cwd(), projectName);

  if (await fs.pathExists(targetDir)) {
    return console.log(`Directory "${projectName}" already exists`);
  }

  console.log("Creating project...");

  let dirCreated = false;

  try {
    // Create the target directory
    await fs.ensureDir(targetDir);
    dirCreated = true;

    // Copy base template
    await copyBase(targetDir);

    // Select and prune modules
    const selectedModules = await selectModules();

    // Check if user cancelled module selection
    if (selectedModules === null) {
      console.log("\nProject creation cancelled");
      await cleanup(targetDir);
      process.exit(0);
    }

    console.log("Selected modules:", selectedModules);
    await pruneModules(targetDir, selectedModules);

    await writeEnabledModulesConfig(targetDir, selectedModules);

    console.log(`Project "${projectName}" created successfully`);
    console.log(`cd ${projectName} && yarn install && yarn dev`);
  } catch (error) {
    console.error("Error during project creation:", error);

    // Revert by removing the created directory
    if (dirCreated) {
      await cleanup(targetDir);
    }

    console.log("Project creation failed and changes have been reverted");
    process.exit(1);
  }
}