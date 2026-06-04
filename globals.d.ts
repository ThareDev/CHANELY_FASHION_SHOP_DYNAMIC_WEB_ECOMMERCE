// globals.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Specifically for side-effect imports
declare module '*.css' {
  const content: any;
  export default content;
}