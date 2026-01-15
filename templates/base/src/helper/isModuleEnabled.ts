import enabledModules from "@/config/enabled-modules.json";

type EnabledModulesConfig =
  | { mode: "all" }
  | { mode: "selective"; modules: string[] };

const config = enabledModules as EnabledModulesConfig;

export function isModuleEnabled(module?: string): boolean {
  if (!module) return true;

  if (config.mode === "all") {
    return true;
  }

  return config.modules.includes(module);
}
