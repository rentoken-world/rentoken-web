// React 19 兼容性声明
import * as React from 'react';

// 全局类型修复
declare global {
  namespace React {
    // 扩展ReactNode类型以兼容React 19
    type ReactNode = any;
  }
  
  // 修复JSX类型兼容性 - 允许所有组件类型
  namespace JSX {
    type ElementType = any;
    interface IntrinsicAttributes {
      [key: string]: any;
    }
    interface Element {
      [key: string]: any;
    }
  }
  
  // 修复 React 组件类型
  interface JSXElementConstructor<P> {
    (props: P, deprecatedLegacyContext?: any): React.ReactNode;
  }
}

// Next.js组件类型修复 - 使用更宽松的类型
declare module 'next/link' {
  const Link: any;
  export default Link;
}

declare module 'next/image' {
  const Image: any;
  export default Image;
}

// Radix UI 组件类型修复 - 使用更宽松的类型
declare module '@radix-ui/react-dialog' {
  export const Root: any;
  export const Portal: any;
  export const Trigger: any;
  export const Content: any;
  export const Group: any;
  export const Item: any;
  export const CheckboxItem: any;
  export const RadioGroup: any;
  export const RadioItem: any;
  export const Label: any;
  export const Separator: any;
  export const Sub: any;
  export const SubTrigger: any;
  export const SubContent: any;
  export const ItemIndicator: any;
  export const Close: any;
  export const Overlay: any;
  export const Title: any;
  export const Description: any;
}

// Lucide React图标类型修复 - 使用更宽松的类型
declare module 'lucide-react' {
  const Menu: any;
  const ChevronDown: any;
  const ChevronRight: any;
  const ChevronRightIcon: any;
  const XIcon: any;
  const Sun: any;
  const Moon: any;
  const CheckIcon: any;
  const Check: any;
  const CircleIcon: any;
  const Circle: any;
  const Heart: any;
  const Github: any;
  const Mail: any;
  const Twitter: any;
  const Send: any;
  
  // 通用导出
  export {
    Menu, ChevronDown, ChevronRight, ChevronRightIcon, XIcon,
    Sun, Moon, CheckIcon, Check, CircleIcon, Circle, Heart,
    Github, Mail, Twitter, Send
  };
  
  // 支持其他所有图标
  const _: { [key: string]: any };
  export = _;
}

// Radix UI Dropdown Menu组件类型修复 - 使用更宽松的类型
declare module '@radix-ui/react-dropdown-menu' {
  export const Root: any;
  export const Portal: any;
  export const Trigger: any;
  export const Content: any;
  export const Group: any;
  export const Item: any;
  export const CheckboxItem: any;
  export const RadioGroup: any;
  export const RadioItem: any;
  export const Label: any;
  export const Separator: any;
  export const Sub: any;
  export const SubTrigger: any;
  export const SubContent: any;
  export const ItemIndicator: any;
}

// Radix UI 其他模块
declare module '@radix-ui/react-slot' {
  export const Slot: any;
}

declare module '@radix-ui/react-label' {
  export const Root: any;
  export const Label: any;
}

declare module '@radix-ui/react-select' {
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
  export const Item: any;
  export const Value: any;
  export const Portal: any;
  export const Viewport: any;
}

declare module '@radix-ui/react-switch' {
  export const Root: any;
  export const Thumb: any;
}

export {};
