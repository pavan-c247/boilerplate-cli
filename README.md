# Frontend Theme CLI

A CLI tool to generate a **Next.js boilerplate project** with **only the modules you need**.

This tool helps teams avoid bloated boilerplates by letting you **select features at project creation time**, ensuring unused code is completely removed.

---

## ✨ What This CLI Does

- Generates a new Next.js project from a production-ready boilerplate
- Lets you **select optional modules** (CMS, Documents, FAQ, Bulk Import, etc.)
- **Physically removes** unselected modules (no dead code)
- Automatically adjusts runtime config (like sidebar navigation)
- Provides a **one-command developer experience**

---

## 🚀 Quick Start

You **do not need to install anything globally**.

The CLI can be executed in **two ways**:

---

### ✅ Option 1: Run via npm (Recommended)

This is the **recommended and production-ready approach**.

```bash
npx @pavan-c247/frontend-theme

```

**Why use this?**

- Stable, versioned releases
- Faster installs (npm CDN)
- Industry-standard distribution
- Best for teams and long-term usage

---

### ⚠️ Option 2: Run directly from GitHub

This is useful for **internal testing or experimentation**.

```bash
npx https://github.com/pavan-c247/boilerplate-cli.git

```

**Important notes:**

- The GitHub repository is temporarily downloaded and installed
- No version pinning (always runs latest commit)
- Slower than npm-based execution
- Not recommended for production teams

> GitHub-based execution behaves similarly to npm-based npx,
> 
> 
> but lacks release and version guarantees.
> 

---

## 🧭 Interactive Flow

When you run the command, the CLI will prompt you for:

1. **Project name**
2. **Modules to include** (multi-select)

Example:

```
✔Project name:my-app
✔Select modules:
◯CMS
◉Documents
◯FAQ
◯BulkImport

```

---

## 📁 What Gets Created

After completion, you’ll have:

```
my-app/
├── src/
├── public/
├──package.json
├──next.config.ts
└── ...

```

Only the modules you selected will be present.

Unused routes, components, hooks, services, and locale files are **fully removed**.

---

## ▶️ Running the Generated Project

After the CLI finishes:

```bash
cd my-app
npm install

```

or if you use Yarn:

```bash
yarn install

```

---

### Environment Setup

Create a `.env` file (or copy from example):

```bash
cp .env.example .env

```

Update environment variables as required for your project.

---

### Start Development Server

```bash
npm run dev

```

or

```bash
yarn dev

```

The app will be available at:

```
http://localhost:3000

```

---

## 🧩 How Module Selection Works (High Level)

1. The CLI copies the **entire boilerplate**
2. You select which modules you want
3. Files belonging to **unselected modules are deleted**
4. A runtime config file is generated:

```
src/config/enabled-modules.json

```

Example:

```json
{
"modules":["documents","cms"]
}

```

This file is used by the app to:

- Hide sidebar items
- Avoid broken routes
- Keep runtime behavior consistent

---

## 📦 Available Modules

| Module | Description |
| --- | --- |
| CMS | Content management system |
| Documents | Document upload & management |
| FAQ | FAQ pages and UI |
| Bulk Import | Admin bulk upload flows |

> Core features like Dashboard, Users, and Shared Components are always included.
> 

---

## 🧠 Architecture Overview (For Advanced Users)

This CLI follows a **manifest-driven pruning approach**.

### Why this matters

- No guessing what files belong to a module
- No fragile copy logic
- Safe, repeatable project generation

---

### Key Configuration Files

### `templates/meta/modules.json`

Controls **what users see** in the CLI prompt.

```json
{
"modules":{
"cms":{
"label":"CMS",
"description":"Content management system",
"default":false
}
}
}

```

---

### `templates/base/modules.manifest.json`

Controls **what files belong to each module**.

```json
{
"modules":{
"cms":{
"paths":[
"src/app/(view)/cms",
"src/components/cms",
"src/hooks/cms.ts",
"src/services/cms.ts"
]
}
}
}

```

If a module is not selected, **all listed paths are deleted**.

---

## ➕ Adding a New Module (Maintainers)

1. Add module code to the boilerplate
2. Register owned files in `modules.manifest.json`
3. Expose the module in `modules.json`
4. (Optional) Tag sidebar items with `module`

No CLI logic changes required.

---

## 🛠 Node & Package Manager Support

- Node.js **18+** recommended
- Works with:
    - npm
    - yarn
    - pnpm

---

## 📌 Common Notes

- Prefer **npm-based `npx`** for production usage
- GitHub-based execution is best for testing or internal use
- The CLI does **not** install dependencies automatically
- Always `cd` into the generated folder before running commands

---

## 📄 License

MIT License