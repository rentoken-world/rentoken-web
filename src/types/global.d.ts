// React 19 兼容性声明
import * as React from 'react';

declare global {
  namespace React {
    // 扩展ReactNode类型以兼容React 19
    type ReactNode = React.ReactElement | React.ReactFragment | React.ReactPortal | string | number | boolean | null | undefined | bigint;
  }
}

// Next.js组件类型修复
declare module 'next/link' {
  import React from 'react';
  
  interface LinkProps {
    href: string;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  const Link: React.ComponentType<LinkProps>;
  export default Link;
}

declare module 'next/image' {
  import React from 'react';
  
  interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  const Image: React.ComponentType<ImageProps>;
  export default Image;
}

// Radix UI组件类型修复
declare module '@radix-ui/react-dialog' {
  import React from 'react';
  
  export interface SheetProps {
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export interface SheetTriggerProps {
    asChild?: boolean;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export interface SheetContentProps {
    side?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export interface SheetTitleProps {
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export const Sheet: React.ComponentType<SheetProps>;
  export const SheetTrigger: React.ComponentType<SheetTriggerProps>;
  export const SheetContent: React.ComponentType<SheetContentProps>;
  export const SheetHeader: React.ComponentType<{ children?: React.ReactNode; className?: string; [key: string]: any }>;
  export const SheetTitle: React.ComponentType<SheetTitleProps>;
}

// Lucide React图标类型修复
declare module 'lucide-react' {
  import React from 'react';
  
  interface LucideIconProps {
    size?: string | number;
    color?: string;
    className?: string;
    [key: string]: any;
  }
  
  export const Menu: React.ComponentType<LucideIconProps>;
  export const ChevronDown: React.ComponentType<LucideIconProps>;
  export const Sun: React.ComponentType<LucideIconProps>;
  export const Moon: React.ComponentType<LucideIconProps>;
  // 根据需要添加其他图标
  [key: string]: React.ComponentType<LucideIconProps>;
}

export {};
