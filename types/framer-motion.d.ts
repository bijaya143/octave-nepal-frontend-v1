declare module "framer-motion" {
  import * as React from "react";
  export const motion: any;
  export function useInView(
    ref: React.RefObject<Element | null> | Element | null,
    options?: any
  ): boolean;
  export function useScroll(options?: any): {
    scrollYProgress: any;
    scrollXProgress: any;
  };
  export function useTransform(
    value: any,
    input: any[],
    output: any[],
    options?: any
  ): any;
  export type Variants = Record<string, any>;
}


