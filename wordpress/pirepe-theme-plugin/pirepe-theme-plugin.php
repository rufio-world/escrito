<?php
/**
 * Plugin Name: Pirepe Builder Companion
 * Description: Editor extensions and block library for the Pirepe Builder theme.
 * Version: 0.1.0
 * Author: Pirepe Team
 * License: GPL-2.0-or-later
 * Text Domain: pirepe-theme
 */

if (!defined('ABSPATH')) {
    exit;
}

const PIREPE_THEME_PLUGIN_VERSION = '0.1.0';

function pirepe_theme_register_block_assets(): void
{
    $asset_path = plugin_dir_path(__FILE__) . 'assets/editor.asset.php';
    $dependencies = [];
    $version = PIREPE_THEME_PLUGIN_VERSION;

    if (file_exists($asset_path)) {
        $asset = require $asset_path;
        $dependencies = $asset['dependencies'] ?? [];
        $version = $asset['version'] ?? $version;
    }

    wp_register_script(
        'pirepe-theme-blocks',
        plugins_url('assets/editor.js', __FILE__),
        $dependencies,
        $version,
        true
    );

    wp_register_style(
        'pirepe-theme-editor',
        plugins_url('assets/editor.css', __FILE__),
        [],
        $version
    );

    wp_register_style(
        'pirepe-theme-frontend',
        plugins_url('assets/style.css', __FILE__),
        [],
        $version
    );

    $block_paths = [
        'container',
        'grid',
        'columns',
        'column',
        'spacer',
        'divider',
        'tabs',
        'tab',
        'accordion',
        'accordion-item',
        'carousel',
        'slide',
    ];

    foreach ($block_paths as $block_path) {
        register_block_type(__DIR__ . '/blocks/' . $block_path, [
            'editor_script' => 'pirepe-theme-blocks',
            'editor_style' => 'pirepe-theme-editor',
            'style' => 'pirepe-theme-frontend',
        ]);
    }

    register_block_type(__DIR__ . '/blocks/dynamic-text', [
        'editor_script' => 'pirepe-theme-blocks',
        'editor_style' => 'pirepe-theme-editor',
        'style' => 'pirepe-theme-frontend',
        'render_callback' => 'pirepe_theme_render_dynamic_text',
    ]);
}
add_action('init', 'pirepe_theme_register_block_assets');

/**
 * Register editor settings for responsive controls.
 */
function pirepe_theme_register_editor_settings(): void
{
    register_setting('editor', 'pirepe_theme_breakpoints', [
        'type' => 'object',
        'show_in_rest' => true,
        'default' => [
            'mobile' => '480px',
            'tablet' => '768px',
            'desktop' => '1024px',
        ],
    ]);
}
add_action('init', 'pirepe_theme_register_editor_settings');

/**
 * Render dynamic text from post context.
 *
 * @param array $attributes Block attributes.
 * @param string $content Block content.
 * @param WP_Block $block Block instance.
 * @return string
 */
function pirepe_theme_render_dynamic_text(array $attributes, string $content, WP_Block $block): string
{
    $source = $attributes['source'] ?? 'post_title';
    $post_id = $block->context['postId'] ?? 0;

    if (!$post_id) {
        return '';
    }

    if ($source === 'post_meta') {
        $meta_key = $attributes['metaKey'] ?? '';
        if (!$meta_key) {
            return '';
        }
        $meta_value = get_post_meta($post_id, $meta_key, true);
        if (is_array($meta_value)) {
            $meta_value = wp_json_encode($meta_value);
        }
        return esc_html((string) $meta_value);
    }

    return esc_html(get_the_title($post_id));
}
