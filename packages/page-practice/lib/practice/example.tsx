import {
  Component,
  type ForwardedRef,
  forwardRef,
  memo,
  type ReactNode,
  type RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

function ExampleRaw(
  { value }: { readonly value: string },
  ref: ForwardedRef<HTMLDivElement>,
): ReactNode {
  return <div ref={ref}>{value}</div>;
}

export const Example = memo(forwardRef(ExampleRaw));

export function Container(): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  useZoom(ref);
  return (
    <main>
      <Example ref={ref} value="123" />
    </main>
  );
}

export function useZoom(ref: RefObject<HTMLElement>): void {
  const elem = ref.current;
  const zoom = useRef(1);

  useEffect(() => {
    if (elem == null) {
      return;
    }

    const onWheel = (ev: WheelEvent) => {
      elem.style.transform = `scale(${zoom.current})`;
    };
    const onMouseDown = (ev: MouseEvent) => {
      //
    };
    const onMouseUp = (ev: MouseEvent) => {
      //
    };
    const onMouseMove = (ev: MouseEvent) => {
      //
    };

    elem.addEventListener("wheel", onWheel);
    elem.addEventListener("mousedown", onMouseDown);
    elem.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      elem.removeEventListener("wheel", onWheel);
      elem.removeEventListener("mousedown", onMouseDown);
      elem.removeEventListener("mouseup", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [elem]);
}

class ElemComponent extends Component<{
  text: string;
  innerRef: ForwardedRef<HTMLDivElement>;
  anotherRef?: ForwardedRef<HTMLDivElement>;
}> {
  override render(): ReactNode {
    const { text, innerRef } = this.props;
    return <div ref={innerRef}>{text}</div>;
  }
}

const Elem = forwardRef(function Elem(
  props: { text: string },
  ref: ForwardedRef<HTMLDivElement>,
): ReactNode {
  return <ElemComponent innerRef={ref} {...props} />;
});

type MyInputHandle = { focus(): void; scrollIntoView(): void };

const MyInput = forwardRef(function MyInput(
  props: { readonly value: string },
  ref: ForwardedRef<MyInputHandle>,
): ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          inputRef.current?.focus();
        },
        scrollIntoView() {
          inputRef.current?.scrollIntoView();
        },
      };
    },
    [],
  );

  return <input {...props} ref={inputRef} />;
});
