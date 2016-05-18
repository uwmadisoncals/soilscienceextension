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

include_once('inputtitle_submit_inc.php');


/**
 * [This function shortens the length of the SimplePie RSS item description]
 * 
 * @see: $rss and $rss_items on index.php
 * @link: http://simplepie.org/wiki/tutorial/shorten_titles_and_descriptions
 * @param   [string] $string [ the string to be shortened ]
 * @param   [int] $length [the number of characters the string should be shortened to]
 * @return  [string]         [the shortened string]
 */
function shortenSimplePie($string, $length){

	$length = $length - 10 ;

	//$suffix = '&hellip;';
	$suffix = '&hellip;' . '&nbsp;' . '<a class="more-link" href="">Read More</a>';


	$short_desc = trim(str_replace(array("\r","\n","\t"), '', strip_tags($string)));

	$desc = trim(substr($short_desc,0,$length));
	$lastchar = substr($desc,-1,1);

	if($lastchar == '.' || $lastchar == '!' || $lastchar =='?') $suffix='';

	$desc .= $suffix;

	return $desc;
}


//override calsmain2013(parent theme) 'more' text for excerpts
function child_theme_setup(){
	remove_filter('excerpt_more', 'twentyeleven_auto_excerpt_more');
	remove_filter('get_the_excerpt', 'twentyeleven_custom_excerpt_more' );
	remove_filter('excerpt_length', 'twentyeleven_excerpt_length');
}
add_action('after_setup_theme', 'child_theme_setup');

//Replace excerpt "more" with link to post
function new_excerpt_more($more){
	global $post;
	return '&nbsp;<a class="more-link" href="'. get_permalink($post->ID) . '">Read more...</a>';
}
add_filter('excerpt_more', 'new_excerpt_more');


//Custom excerpt length based on category
function wspe_excerpt_length($length){

	if(in_category( 'news')){
		return 20;//if news
	}else{
		return 40;//default
	}

}
add_filter('excerpt_length','wspe_excerpt_length');

