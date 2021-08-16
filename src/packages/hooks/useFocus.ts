import { WritableComputedRef, computed } from "vue";
import { EditorModelValue, EditorBlock, FocusBlock } from "../types/editor";
import { ChangeBlockData } from "../types/utils";

export default function useFocus(
  data: WritableComputedRef<EditorModelValue>,
  changeBlockData: ChangeBlockData,
  callback: (e: MouseEvent) => void
) {
  const focusData = computed(() => {
    const focus: FocusBlock[] = [];
    const unfocus: FocusBlock[] = [];

    data.value.blocks.forEach((block, index) =>
      (block.focus ? focus : unfocus).push({ ...block, index })
    );

    return {
      focus,
      unfocus,
    };
  });

  const clearBlockFocus = () => {
    data.value.blocks.forEach((block, index) => {
      changeBlockData("focus", false, index);
    });
  };

  const blockMousedown = (e: MouseEvent, block: EditorBlock, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey) {
      if (focusData.value.focus.length <= 1) {
        changeBlockData("focus", true, index);
      } else {
        changeBlockData("focus", !block.focus, index);
      }
    } else {
      if (!block.focus) {
        clearBlockFocus();
        changeBlockData("focus", true, index);
      }
    }
    callback(e);
  };

  const containerMousedown = () => {
    clearBlockFocus();
  };

  return {
    focusData,
    blockMousedown,
    containerMousedown,
  };
}
