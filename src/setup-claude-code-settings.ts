import { $ } from "bun";
import { homedir } from "os";

export async function setupClaudeCodeSettings() {
  const home = homedir();
  const globalSettingsPath = `${home}/.claude/settings.json`;
  const localSettingsPath = `.claude/settings.local.json`;

  console.log(`Setting up Claude settings in both locations:`);
  console.log(`  - Global: ${globalSettingsPath}`);
  console.log(`  - Local: ${localSettingsPath}`);
  console.log(`  - Current directory: ${process.cwd()}`);

  // Ensure .claude directories exist
  console.log("Creating .claude directories...");
  await $`mkdir -p ${home}/.claude`.quiet();
  await $`mkdir -p .claude`.quiet();

  // Process global settings
  let globalSettings: Record<string, unknown> = {};
  try {
    const existingSettings = await $`cat ${globalSettingsPath}`.quiet().text();
    if (existingSettings.trim()) {
      globalSettings = JSON.parse(existingSettings);
      console.log(
        "Found existing global settings:",
        JSON.stringify(globalSettings, null, 2),
      );
    }
  } catch (e) {
    console.log("No existing global settings file found");
  }

  globalSettings.enableAllProjectMcpServers = true;

  // Process local settings
  let localSettings: Record<string, unknown> = {};
  try {
    const existingSettings = await $`cat ${localSettingsPath}`.quiet().text();
    if (existingSettings.trim()) {
      localSettings = JSON.parse(existingSettings);
      console.log(
        "Found existing local settings:",
        JSON.stringify(localSettings, null, 2),
      );
    }
  } catch (e) {
    console.log("No existing local settings file found");
  }

  localSettings.enableAllProjectMcpServers = true;

  // Write both settings files
  console.log("Writing settings with enableAllProjectMcpServers: true");
  await $`echo ${JSON.stringify(globalSettings, null, 2)} > ${globalSettingsPath}`.quiet();
  // await $`echo ${JSON.stringify(localSettings, null, 2)} > ${localSettingsPath}`.quiet();

  console.log("Settings saved successfully to both locations");
  console.log(
    "Final global settings:",
    JSON.stringify(globalSettings, null, 2),
  );
  console.log("Final local settings:", JSON.stringify(localSettings, null, 2));
}
