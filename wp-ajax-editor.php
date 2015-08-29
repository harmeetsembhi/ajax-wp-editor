<?php
/*
	Plugin Name: Ajax Editor
	Author: Harmeet Sembhi
	Author URI: http://www.themefossil.com
	Description: Load WP Using AJAX Request
	Version: 1.0
	Text Domain: ajax_editor
 */

/**
 * Base Constants
 */
define('AE_URL', plugin_dir_url( __FILE__ ));
define('AE_PATH', plugin_dir_path( __FILE__ ));



// INCLUDE ALL CLASSES
foreach ( glob( AE_PATH . "/classes/class.*.php") as $filename) {
    include $filename;
}

// Includes
foreach ( glob( AE_PATH . "/includes/inc*.php") as $filename) {
    include $filename;
}
