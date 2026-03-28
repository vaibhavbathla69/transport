declare module "@lottiefiles/dotlottie-react" {
  import type {
    CanvasHTMLAttributes,
    ReactNode,
    RefCallback,
  } from "react";

  export type DotLottieInstance = {
    addEventListener: (event: string, listener: () => void) => void;
    play: () => void;
    pause: () => void;
    removeEventListener: (event: string, listener?: () => void) => void;
    setLoop: (loop: boolean) => void;
    stop: () => void;
  };

  export type DotLottieReactProps = CanvasHTMLAttributes<HTMLCanvasElement> & {
    src?: string;
    autoplay?: boolean;
    loop?: boolean;
    speed?: number;
    layout?: {
      fit?: "contain" | "cover" | "fill" | "none" | "fit-width" | "fit-height";
      align?: [number, number];
    };
    renderConfig?: {
      autoResize?: boolean;
      devicePixelRatio?: number;
      freezeOnOffscreen?: boolean;
    };
    dotLottieRefCallback?: RefCallback<DotLottieInstance | null>;
  };

  export function DotLottieReact(props: DotLottieReactProps): ReactNode;
}
