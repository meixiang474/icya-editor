import { DragState, FocusData } from "../types/editor";
import { ChangeBlockData } from "../types/utils";

export default function useBlockDragger(
  focusData: FocusData,
  changeBlockData: ChangeBlockData
) {
  const dragState: DragState = {
    startX: 0,
    startY: 0,
  };
  const mouseup = () => {
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
  };
  const mousemove = (e: MouseEvent) => {
    const { clientX: moveX, clientY: moveY } = e;
    const durX = moveX - dragState.startX;
    const durY = moveY - dragState.startY;

    focusData.value.focus.forEach((block, index) => {
      changeBlockData(
        "top",
        dragState.startPos![index].top + durY,
        block.index
      );
      changeBlockData(
        "left",
        dragState.startPos![index].left + durX,
        block.index
      );
    });
  };
  const mousedown = (e: MouseEvent) => {
    // 记录初始坐标
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    dragState.startPos = focusData.value.focus.map(({ left, top }) => ({
      left,
      top,
    }));
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };

  return {
    mousedown,
  };
}
