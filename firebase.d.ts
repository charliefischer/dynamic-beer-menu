declare module 'firebase/app' {
  interface FirebaseApp {
    apps: {
      [name: string]: FirebaseApp;
    };
  }

  export function initializeApp(config: Object, name?: string): FirebaseApp;
}
