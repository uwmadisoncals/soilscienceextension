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



function wcmc_ajax(){

	require_once("wcmcAJAX.php");
	$ajaxResponse = wcmcAutoComplete($customTerms);
	print_r($ajaxResponse);
}