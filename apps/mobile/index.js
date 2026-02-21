import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// This is the manual way to start Expo Router without relying on 'expo-router/entry'
// which can sometimes trigger resolution issues in monorepos.
export function App() {
  // @ts-ignore
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

export default App;

registerRootComponent(App);
