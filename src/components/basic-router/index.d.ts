import { App } from 'vue';

declare module 'BasicRouter' {
  export interface InstallationOptions {}

  export function install(vue: App, options: any[]): void;
}
