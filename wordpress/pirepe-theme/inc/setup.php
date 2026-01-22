<?php
/**
 * Theme setup for Pirepe Builder.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register theme supports and editor assets.
 */
function pirepe_theme_setup(): void
{
    add_theme_support('editor-styles');
    add_theme_support('wp-block-styles');
    add_theme_support('align-wide');
    add_theme_support('responsive-embeds');
    add_theme_support('appearance-tools');
    add_theme_support('block-nav-menus');

    add_editor_style('assets/css/editor.css');
}
add_action('after_setup_theme', 'pirepe_theme_setup');

/**
 * Enqueue theme styles.
 */
function pirepe_theme_enqueue_assets(): void
{
    wp_enqueue_style(
        'pirepe-theme',
        get_stylesheet_uri(),
        [],
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'pirepe_theme_enqueue_assets');

/**
 * Register block pattern categories.
 */
function pirepe_theme_register_pattern_categories(): void
{
    register_block_pattern_category(
        'pirepe-theme-sections',
        ['label' => __('Pirepe Sections', 'pirepe-theme')]
    );
}
add_action('init', 'pirepe_theme_register_pattern_categories');
