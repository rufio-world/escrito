# Pirepe Builder Architecture

This repository includes a WordPress theme + companion plugin scaffold that aligns with Gutenberg and Full Site Editing (FSE). The goal is to provide a native-first visual builder foundation without external page builder dependencies.

## Theme vs Plugin

- **Theme (`pirepe-theme`)**
  - Owns presentation, templates, patterns, and global styles.
  - Defines design tokens and defaults in `theme.json`.
  - Ships FSE templates and reusable pattern sections.
- **Companion Plugin (`pirepe-theme-plugin`)**
  - Owns custom blocks, editor extensions, and builder controls.
  - Registers block assets and editor settings (breakpoints, etc.).
  - Provides a location for future block variations, SlotFill UI, and editor data stores.

## Block Registration Strategy

- Each block lives in `blocks/<block>/block.json` with metadata.
- The plugin registers block types on `init`, wiring script and editor styles.
- Front-end block styles are registered separately to avoid editor-only CSS shipping to the site.
- Blocks are designed to be _layout-first_ and nested with `InnerBlocks` to keep markup minimal.

## Visual Builder Foundations

- The `pirepe/container` block acts as the primary layout surface for flex-based design.
- Builder settings live on block attributes (`builderSettings`) to allow responsive and device-specific metadata.
- Responsive breakpoints are registered via `register_setting` so the editor can read defaults.
- Additional layout primitives (grid, columns, spacer, divider) and interactive blocks (tabs, accordion, carousel) are registered in the companion plugin as native blocks.
- Dynamic text blocks render post context or post meta via REST-powered previews in the editor and a PHP render callback on the front end.

## Extensibility

- Theme supports block styles and editor styles out of the box.
- Add new blocks by mirroring the container block structure.
- Editor extensions should use WordPress SlotFill APIs and the block editor store for state.

## Performance Principles

- Theme styles live in `theme.json` to avoid heavy front-end CSS.
- Blocks prioritize minimal DOM, `InnerBlocks`, and native supports.
- Scripts are loaded only in the editor.
