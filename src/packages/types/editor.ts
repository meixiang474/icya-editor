import { ComputedRef } from "vue";

export interface EditorModelValue {
  container: {
    width: number;
    height: number;
  };
  blocks: EditorBlock[];
}

export interface EditorBlock {
  left: number;
  top: number;
  zIndex: number;
  key: string;
  // 是否相对鼠标居中
  alignCenter?: boolean;
  focus?: boolean;
}

export interface FocusBlock extends EditorBlock {
  index: number;
}

export type FocusData = ComputedRef<{
  focus: FocusBlock[];
  unfocus: FocusBlock[];
}>;

export type ValueOf<T> = T[keyof T];

export interface DragState {
  startX: number;
  startY: number;
  startPos?: {
    top: number;
    left: number;
  }[];
}
