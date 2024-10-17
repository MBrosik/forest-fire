// I quite don't understand why do I have to use export here
// it should work without this keyword but for some reason
// TypeScript compiler doesn't see this change without it
export declare global {
  interface Window {
    env: Record<string, string>;
  }
}
