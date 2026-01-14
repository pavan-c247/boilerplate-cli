import enabledModules from "@/config/enabled-modules.json";

export function isModuleEnabled(module?: string): boolean {
  if (!module) return true;
  return enabledModules.modules.includes(module);
}
