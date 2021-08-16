import { WritableComputedRef, Ref } from "vue";
import { EditorModelValue } from "../types/editor";
import { ComponentConfig } from "../types/config";

// eslint-disable-next-line
export default function useMenuDragger(
  data: WritableComputedRef<EditorModelValue>,
  containerRef: Ref<HTMLDivElement>
) {
  let currentComponent: ComponentConfig | null = null;
  const dragenter = (e: DragEvent) => {
    e.dataTransfer!.dropEffect = "move";
  };
  const dragover = (e: DragEvent) => {
    e.preventDefault();
  };
  const dragleave = (e: DragEvent) => {
    e.dataTransfer!.dropEffect = "none";
  };
  const drop = (e: DragEvent) => {
    // 已经渲染的组件
    const blocks = data.value.blocks;
    // 单向数据流
    // blocks.push({
    //   top: e.offsetY,
    //   left: e.offsetX,
    //   zIndex: 1,
    //   key: currentComponent!.key,
    //   alignCenter: true,
    // });
    data.value = {
      ...data.value,
      blocks: [
        ...blocks,
        {
          top: e.offsetY,
          left: e.offsetX,
          zIndex: 1,
          key: currentComponent!.key,
          alignCenter: true,
        },
      ],
    };
    currentComponent = null;
  };

  const dragstart = (e: DragEvent, component: ComponentConfig) => {
    // dragover必须阻止默认行为否则不能触发drop
    containerRef.value.addEventListener("dragenter", dragenter);
    containerRef.value.addEventListener("dragover", dragover);
    containerRef.value.addEventListener("dragleave", dragleave);
    containerRef.value.addEventListener("drop", drop);
    currentComponent = component;
  };

  const dragend = () => {
    containerRef.value.removeEventListener("dragenter", dragenter);
    containerRef.value.removeEventListener("dragover", dragover);
    containerRef.value.removeEventListener("dragleave", dragleave);
    containerRef.value.removeEventListener("drop", drop);
  };

  return {
    dragstart,
    dragend,
  };
}
