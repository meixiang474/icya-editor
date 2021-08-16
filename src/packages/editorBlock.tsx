import { EditorBlock } from "./types/editor";
import {
  computed,
  defineComponent,
  PropType,
  inject,
  onMounted,
  ref,
} from "vue";
import { EditorConfigProvide } from "./types/config";
import * as Constants from "./constants";
import { ValueOf } from "element-plus/lib/el-table/src/table-column/defaults";

type ChangeBlockData = (
  key: keyof EditorBlock,
  val: ValueOf<EditorBlock>,
  index: number
) => void;

type OnMouseDown = (e: MouseEvent) => void;

export default defineComponent({
  name: "EditorBlock",
  props: {
    block: {
      type: Object as PropType<EditorBlock>,
      required: true,
    },
    changeBlockData: {
      type: Function as PropType<ChangeBlockData>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    onMousedown: {
      type: Function as PropType<OnMouseDown>,
      required: true,
    },
  },
  setup(props) {
    const blockStyles = computed(() => ({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex: props.block.zIndex,
    }));

    const { config } = inject<EditorConfigProvide>(
      Constants.ICYA_EDITOR_CONFIG
    )!;

    const blockRef = ref({} as HTMLDivElement);

    onMounted(() => {
      const { offsetWidth, offsetHeight } = blockRef.value;
      if (props.block.alignCenter) {
        // 拖拽松手时
        props.changeBlockData(
          "left",
          props.block.left - offsetWidth / 2,
          props.index
        );
        props.changeBlockData(
          "top",
          props.block.top - offsetHeight / 2,
          props.index
        );
        props.changeBlockData("alignCenter", false, props.index);
      }
    });

    const classes = computed(() => {
      const classes = ["icya-editor-block"];
      if (props.block.focus) {
        classes.push("icya-editor-block-focus");
      }
      return classes;
    });

    return () => {
      const component = config.value.componentMap[props.block.key];
      const RenderComponent = component.render();
      return (
        <div
          class={classes.value}
          style={blockStyles.value}
          ref={blockRef}
          onMousedown={props.onMousedown}
        >
          {RenderComponent}
        </div>
      );
    };
  },
});
