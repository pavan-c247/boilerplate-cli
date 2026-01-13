import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import prompts from "prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLI_ROOT = path.resolve();
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
async function selectModules(): Promise<string[]> {
  const meta = await fs.readJson(META_FILE);
  const choices: ModuleChoice[] = Object.entries(meta.modules).map(([key, val]: any) => ({
    title: val.label,
    value: key,
    description: val.description,
    selected: val.default || false,
  }));

  const response = await prompts({
    type: "multiselect",
    name: "modules",
    message: "Select modules to include:",
    choices,
  });

  return response.modules || [];
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

// init function
export async function init() {
  const projectName = await getProjectName();
  if (!projectName) return console.log("Project creation cancelled");

  const targetDir = path.resolve(process.cwd(), projectName);

  if (await fs.pathExists(targetDir)) {
    return console.log(`Directory "${projectName}" already exists`);
  }

  console.log("Creating project...");

  await fs.ensureDir(targetDir);
  await copyBase(targetDir);

  const selectedModules = await selectModules();
  await pruneModules(targetDir, selectedModules);

  console.log(`Project "${projectName}" created successfully`);
  console.log(`cd ${projectName} && yarn install && yarn dev`);
}





// export async function init() {
//     const response = await prompts({
//         type: "text",
//         name: "projectName",
//         message: "Project name:",
//         validate: (value: string) =>
//             value.trim().length > 0 ? true : "Project name cannot be empty",
//     });

//     const projectName = response.projectName;

//     if (!projectName) {
//         console.log("❌ Project creation cancelled");
//         return;
//     }

//     const templateDir = path.resolve(__dirname, "../templates/base");
//     const targetDir = path.resolve(process.cwd(), projectName);

//     if (await fs.pathExists(targetDir)) {
//         console.log(`❌ Directory "${projectName}" already exists`);
//         return;
//     }

//     console.log("📦 Creating project...");

//     await fs.copy(templateDir, targetDir);

//     console.log(`✅ Project "${projectName}" created successfully`);
//     console.log(`👉 cd ${projectName}`);
// }
