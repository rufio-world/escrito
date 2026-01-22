<?php
/**
 * Plugin Name: Escrito Builder Companion
 * Description: Editor extensions and block library for the Escrito Builder theme.
 * Version: 0.1.0
 * Author: Escrito Team
 * License: GPL-2.0-or-later
 * Text Domain: escrito-builder
 */

if (!defined('ABSPATH')) {
    exit;
}

const ESCRITO_BUILDER_PLUGIN_VERSION = '0.1.0';

function escrito_builder_register_block_assets(): void
{
    $asset_path = plugin_dir_path(__FILE__) . 'assets/editor.asset.php';
    $dependencies = [];
    $version = ESCRITO_BUILDER_PLUGIN_VERSION;

    if (file_exists($asset_path)) {
        $asset = require $asset_path;
        $dependencies = $asset['dependencies'] ?? [];
        $version = $asset['version'] ?? $version;
    }

    wp_register_script(
        'escrito-builder-blocks',
        plugins_url('assets/editor.js', __FILE__),
        $dependencies,
        $version,
        true
    );

    wp_register_style(
        'escrito-builder-editor',
        plugins_url('assets/editor.css', __FILE__),
        [],
        $version
    );

    wp_register_style(
        'escrito-builder-frontend',
        plugins_url('assets/style.css', __FILE__),
        [],
        $version
    );

    register_block_type(__DIR__ . '/blocks/container', [
        'editor_script' => 'escrito-builder-blocks',
        'editor_style' => 'escrito-builder-editor',
        'style' => 'escrito-builder-frontend',
    ]);
}
add_action('init', 'escrito_builder_register_block_assets');

/**
 * Register editor settings for responsive controls.
 */
function escrito_builder_register_editor_settings(): void
{
    register_setting('editor', 'escrito_builder_breakpoints', [
        'type' => 'object',
        'show_in_rest' => true,
        'default' => [
            'mobile' => '480px',
            'tablet' => '768px',
            'desktop' => '1024px',
        ],
    ]);
}
add_action('init', 'escrito_builder_register_editor_settings');
