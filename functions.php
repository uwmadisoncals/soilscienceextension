<?php

//Page Slug Body Class
function add_slug_body_class( $classes ) {
global $post;
if ( isset( $post ) ) {
$classes[] = $post->post_type . '-' . $post->post_name;
}
return $classes;
}

add_filter( 'body_class', 'add_slug_body_class' );



add_action( 'wp_ajax_autoCompletAjax', 'autoCompletAjax_handler' );
add_action( 'wp_ajax_nopriv_autoCompletAjax', 'autoCompletAjax_handler' );

/**
 * Register, enque, and localize scripts
 * Long description: Localization is necessary when using ajax on the front-end via 
 * wp_ajax_nopriv_*(), because the js Global 'ajaxurl' doesn't exist by default
 * 
 * @since:
 * @see:http://www.benmarshall.me/wordpress-ajax-frontend-backend/ , 
 * http://code.tutsplus.com/tutorials/a-primer-on-ajax-in-the-wordpress-frontend-understanding-the-process--wp-27052
 * @link:
 * @param:
 * @return:
 * @return  [type] [description]
 */
function ajaxScript_scripts(){
wp_register_script('ajaxScript', get_stylesheet_directory_uri() . "/js/ajaxScript.js");
wp_enque_script('ajaxScript');
wp_localize_script("ajaxScript",ajaxVar, array(
	'ajaxurl'=>admin_url('admin-ajax.php')
	));
}

add_action('wp_enque_scripts','ajaxScript_scripts');

function autoCompletAjax_handler(){
  $whatever = intval( $_POST['whatever'] );
  $whatever += 10;
  echo $whatever;
  die(); // this is required to return a proper result
}
add_action('wp_ajax_autoCompletAjax','autoCompletAjax_handler');
//add_action('wp_ajax_nopriv_autoCompletAjax','autoCompletAjax_handler');
