import { EditorBlock, ValueOf } from "./editor";

export type ChangeBlockData = (
  key: keyof EditorBlock,
  value: ValueOf<EditorBlock>,
  index: number
) => void;
