import { ProfileSettingsForm } from "./components/ProfileSettingsForm";
import type { ProfileSettings } from "./types/profile";

export function App() {
  async function handleSave(values: ProfileSettings) {
    // Simulate a network request; replace with your API call.
    await new Promise((resolve) => setTimeout(resolve, 700));
    console.log("Saved profile settings:", values);
  }

  return (
    <main className="app-shell">
      <ProfileSettingsForm onSave={handleSave} />
    </main>
  );
}
