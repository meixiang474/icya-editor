import { Ref, VNode } from "vue";

export interface ComponentConfig {
  label: string;
  preview: () => VNode | string;
  render: () => VNode | string;
  key: string;
}

export interface EditorConfig {
  componentList: ComponentConfig[];
  componentMap: Record<string, ComponentConfig>;
  register: (component: ComponentConfig) => void;
}

export interface EditorConfigProvide {
  config: Ref<EditorConfig>;
}
