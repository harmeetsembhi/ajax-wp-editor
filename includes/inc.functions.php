<?php

function mv_enqueue_scripts() {

	$handle    = 'mv-script-js';
	$src       = AE_URL . 'js/script.js';
	$deps      = array('jquery');
	$ver       = 1.0;
	$in_footer = false;

	wp_enqueue_script( $handle, $src, $deps, $ver, $in_footer );

}
add_action( 'admin_enqueue_scripts', 'mv_enqueue_scripts');


function get_wp_editor() {

	$id = $_POST['editorID'];
	$content = $_POST['content'];

	add_filter( 'wp_default_editor', create_function('', 'return "visual";') );

	wp_editor( $content, $id );

	die();
}

add_action('wp_ajax_get_wp_editor', 'get_wp_editor');

// var_dump( $_REQUEST );
// die();
