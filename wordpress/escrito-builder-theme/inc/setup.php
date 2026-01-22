<?php
/**
 * Theme setup for Escrito Builder.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register theme supports and editor assets.
 */
function escrito_builder_theme_setup(): void
{
    add_theme_support('editor-styles');
    add_theme_support('wp-block-styles');
    add_theme_support('align-wide');
    add_theme_support('responsive-embeds');
    add_theme_support('appearance-tools');
    add_theme_support('block-nav-menus');

    add_editor_style('assets/css/editor.css');
}
add_action('after_setup_theme', 'escrito_builder_theme_setup');

/**
 * Enqueue theme styles.
 */
function escrito_builder_enqueue_assets(): void
{
    wp_enqueue_style(
        'escrito-builder-theme',
        get_stylesheet_uri(),
        [],
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'escrito_builder_enqueue_assets');

/**
 * Register block pattern categories.
 */
function escrito_builder_register_pattern_categories(): void
{
    register_block_pattern_category(
        'escrito-builder-sections',
        ['label' => __('Escrito Sections', 'escrito-builder')]
    );
}
add_action('init', 'escrito_builder_register_pattern_categories');
