<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 * @package WordPress
 * @subpackage CALSv1
 * @since CALS 1.0
 */

get_header(); 

$gets =array("year"=> $_GET["yr"],"subject"=> $_GET["subject"], "author"=>$_GET["auth"], "keyword"=> $_GET["keyword"]);
$arr=array();

//returns assoc array of only the set values
foreach ($gets as $key=>$val){
	if(isset($val)){
		$arr[$key]=$val;
	}
}

	switch($arr){
		case (isset($arr["year"]) && isset($arr["subject"])):
		$year=$arr["year"];

			$args = array(
	'numberposts' => -1,
	'post_type' => 'wcmc',
	'meta_query' => array(
							'relation' => 'AND',
									array(
										'key' => 'date',
										'value' => 'Melbourne',
										'compare' => '='
									),
									array(
										'key' => 'attendees',
										'value' => 100,
										'type' => 'NUMERIC',
										'compare' => '>'
									)
						)
);
		break;

		case (isset($arr["year"]) && isset($arr["author"])):
		//print_r("year and author");
		break;

		case (isset($arr["keyword"])):
		//print_r("all years and keyword");
		break;

		default:
		print_r("there has been an error");
		break;

	}
?>


<div class="mobileScroll">
<a href="#" class="mobileNavTriggerLarge" style="display: none;"></a>

	<div id="main">

		<div id="primary">
			<div id="content" role="main">
				<?php

				// args
				$args = array(
					'numberposts' => -1,
					'post_type' => 'wcmc',
					'orderby' => 'meta_value_num',
					'order' => 'ASC'
				);
				 
				// get results
				$the_query = new WP_Query( $args );
				 
				// The Loop
				?>
				<?php if( $the_query->have_posts() ): ?>
					<ul>
					<?php while ( $the_query->have_posts() ) : $the_query->the_post(); ?>
						<li>
							<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
						</li>
					<?php endwhile; ?>
					</ul>
				<?php endif; ?>
				 
				<?php wp_reset_query();  // Restore global post data stomped by the_post(). ?>

			</div><!-- #content -->
		<?php get_sidebar(); ?>
			<div class="clear"></div>

		</div><!-- #primary -->

	</div>
<?php get_footer(); ?>

</div>