import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import prompts from "prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function init() {
    const response = await prompts({
        type: "text",
        name: "projectName",
        message: "Project name:",
        validate: (value: string) =>
            value.trim().length > 0 ? true : "Project name cannot be empty",
    });

    const projectName = response.projectName;

    if (!projectName) {
        console.log("❌ Project creation cancelled");
        return;
    }

    const templateDir = path.resolve(__dirname, "../templates/base");
    const targetDir = path.resolve(process.cwd(), projectName);

    if (await fs.pathExists(targetDir)) {
        console.log(`❌ Directory "${projectName}" already exists`);
        return;
    }

    console.log("📦 Creating project...");

    await fs.copy(templateDir, targetDir);

    console.log(`✅ Project "${projectName}" created successfully`);
    console.log(`👉 cd ${projectName}`);
}
