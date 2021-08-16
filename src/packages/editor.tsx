import { computed, defineComponent, PropType, provide, ref } from "vue";
import {
  EditorBlock as IEditorBlock,
  EditorModelValue,
  ValueOf,
} from "./types/editor";
import { EditorConfig } from "./types/config";
import EditorBlock from "./editorBlock";
import * as Constants from "./constants";
import deepcopy from "deepcopy";
import useMenuDragger from "./hooks/useMenuDragger";
import useFocus from "./hooks/useFocus";
import useBlockDragger from "./hooks/useBlockDragger";

export default defineComponent({
  name: "Editor",
  props: {
    modelValue: {
      type: Object as PropType<EditorModelValue>,
      required: true,
    },
    config: {
      type: Object as PropType<EditorConfig>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, ctx) {
    const data = computed({
      get() {
        return props.modelValue;
      },
      set(newValue: EditorModelValue) {
        ctx.emit("update:modelValue", deepcopy(newValue));
      },
    });

    const config = computed(() => props.config);
    provide(Constants.ICYA_EDITOR_CONFIG, {
      config,
    });

    const containerStyles = computed(() => ({
      width: data.value.container.width + "px",
      height: data.value.container.height + "px",
    }));

    const changeBlockData = (
      key: keyof IEditorBlock,
      val: ValueOf<IEditorBlock>,
      index: number
    ) => {
      const newData = data.value;
      ((newData.blocks[index] as IEditorBlock)[key] as ValueOf<
        IEditorBlock
      >) = val;
      // 单向数据流，但是会造成不相关的组件重复渲染
      // data.value = newData;
    };

    const containerRef = ref({} as HTMLDivElement);

    // 1.实现菜单拖拽功能
    const { dragstart, dragend } = useMenuDragger(data, containerRef);

    // 2.实现获取焦点
    const { focusData, blockMousedown, containerMousedown } = useFocus(
      data,
      changeBlockData,
      (e: MouseEvent) => {
        mousedown(e);
      }
    );

    // 3.实现多个拖拽功能
    const { mousedown } = useBlockDragger(focusData, changeBlockData);

    return () => (
      <div class="icya-wrapper">
        <div class="icya-editor">
          <div class="icya-editor-left">
            {/* 根据注册渲染刘表 */}
            {config.value.componentList.map((component, index) => (
              <div
                key={index}
                class="icya-editor-left-item"
                draggable
                onDragstart={(e) => dragstart(e, component)}
                onDragend={dragend}
              >
                <span>{component.label}</span>
                <div>{component.preview()}</div>
              </div>
            ))}
          </div>
          <div class="icya-editor-top">菜单栏</div>
          <div class="icya-editor-right">属性控制栏目</div>
          <div class="icya-editor-container">
            <div class="icya-editor-container-canvas">
              <div
                class="icya-editor-container-canvas-content"
                style={containerStyles.value}
                ref={containerRef}
                onMousedown={containerMousedown}
              >
                {data.value.blocks.map((block, index) => (
                  <EditorBlock
                    block={block}
                    key={index}
                    index={index}
                    changeBlockData={changeBlockData}
                    onMousedown={(e: MouseEvent) => {
                      blockMousedown(e, block, index);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
