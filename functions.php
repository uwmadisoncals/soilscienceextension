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

	$suffix = '&hellip;';

	$short_desc = trim(str_replace(array("\r","\n","\t"), '', strip_tags($string)));

	$desc = trim(substr($short_desc,0,$length));
	$lastchar = substr($desc,-1,1);

	if($lastchar == '.' || $lastchar == '!' || $lastchar =='?') $suffix='';

	$desc .= $suffix;

	return $desc;
}


add_action('pre_get_posts', 'page_sr2_pgp');

function page_sr2_pgp( $query )
{
	// validate
	if( is_page('sr2') )
	{
		return $query;

	}
	global $variable;
	$variable ="something";
	logit( $variable, '$variable: ');
    // allow the url to alter the query
    // eg: http://www.website.com/events?location=melbourne
    // eg: http://www.website.com/events?location=sydney
    if( isset($_GET['yr']) )
    {

    	$query->set('meta_key', 'yr');
    	$query->set('meta_value', $_GET['year']);

    }   

	// always return
	return $query;

}