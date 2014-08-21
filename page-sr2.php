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

//maps the raw $_GET data to array
$gets =array("year"=> $_GET["yr"],"subject"=> $_GET["subject"], "author"=>$_GET["auth"], "keyword"=> $_GET["keyword"]);

//creates an array, for later use.
$arr=array();

//accepts $gets array filters out unset values, updates $arr
foreach ($gets as $key=>$val){
	if(isset($val)){
		$arr[$key]=$val;
	}
}
//get year value from $arr
$year = $arr["year"];


/////////////////////////////
//The GetWCMC loop         //
/////////////////////////////

if(have_posts()) : 

	$args_getWCMC = array('post_type' =>'wcmc','posts_per_page'=>-1); //define query args

	$getWCMC = new WP_Query($args_getWCMC); //instantiate query object

	$posts_getWCMC = $getWCMC->get_posts(); //get just the posts from this query object

	$arrID = array(); //create empty array

	foreach($posts_getWCMC as $post){ //create an indexed array of all post id's of custom post type 'wcmc' 
		$arrID[] += $post->ID;
	}

	$arrID_date = array(); //create empty array

	foreach ($arrID as $index => $ID) { //create associateive array where key is "id" and value is 'yymmdd date format'
		$arrID_date[$ID] += get_field('date', $ID); 
	}

	$arrID_year = array(); //make new empty array

	foreach ($arrID_date as $id => $date) {
		$str = substr($date, 0, 4); //truncate yymmdd into just the year
			if($year == $str){
				$arrID_year[$id] += $str; //create array showing only data that matches user input for year
			}
		}

	$matchesDate = array(); //make new empty array

	foreach ($arrID_year as $key => $value) { //list only the ID's of the posts that match the year
		$matchesDate[] += $key;
	}

	while($getWCMC->have_posts()): $getWCMC->the_post(); ?>
	<?php
	endwhile;
	wp_reset_postdata(); //reset post data
	else : ?>
	<p>sorry no results are available...on post object $getWCMC</p>

	<?php 
	endif;

	logit( $posts_getWCMC, '$posts_getWCMC:');
	logit( $arrID, '$arrID:');
	logit( $arrID_date, '$arrID_date:');
	logit( $year, '$year:');
	logit( $arrID_year, '$arrID_year:');
	logit( $matchesDate, '$matchesDate:');



/////////////////////////////
// END GetWCMC loop        //
/////////////////////////////

	switch($arr){
		case (isset($arr["year"]) && isset($arr["subject"])):
				$subj=$arr["subject"];

					$args = array(
			'numberposts' => -1,
			'post_type' => 'wcmc',
			'meta_key'=>'subject',
			'meta_value'=>$subj,
			'post__in'=>$matchesDate // In here should go an array of just post ids
			); 

		break; 

		case (isset($arr["year"]) && isset($arr["author"])):

		$year=intval($arr["year"]);
		$author=$arr["author"];

					$args = array(
			'numberposts' => -1,
			'post_type' => 'wcmc',
			'meta_key'=>'author_name1',
			'meta_value'=>$author,
			'post__in'=>$matchesDate
			); 

		break;

		case (isset($arr["keyword"])):
		//$searchType ="keyword";

		$kywd=strtolower($arr["keyword"]);
		$getTerms = get_terms('wcmc_keywords','hide_empty=0');
		//$name_getTerms = $getTerms->name;
		//print_r("all years and keyword");
						/*$args = array(
					'numberposts' => -1,
					'post_type' => 'wcmc',
					'meta_key' => 'kewywords',
					'meta_value' => $kywd
				); */
		
				$args=array(
					'post_type'=>'wcmc',
					'tax_query'=>array(
						array('taxonomy' => 'wcmc_keywords',
						'field' => 'slug',
						'terms' => $kywd)
						)
					);
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
				/*$args = array(
					'numberposts' => -1,
					'post_type' => 'wcmc',
					'orderby' => 'meta_value_num',
					'order' => 'ASC'
				); */
				 
				// get results
				$the_query = new WP_Query( $args );
				 
				// The Loop
				?>
				<?php //logit( $the_query->request, '$the_query->request:' ); ?>
				<?php if( $the_query->have_posts() ): ?>
					<ul>
					<?php while ( $the_query->have_posts() ) : $the_query->the_post(); ?>

						<li>
							<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
						</li>
					<?php endwhile; else: ?>
					<p>sorry no results are available.</p>
					</ul>
				<?php endif; ?>
				 <?php logit( $wp_query, '$wp_query:' ); ?>
				<?php wp_reset_query();  // Restore global post data stomped by the_post(). ?>

			</div><!-- #content -->
		<?php get_sidebar(); ?>
			<div class="clear"></div>

		</div><!-- #primary -->

	</div>


	<?php
	//logit( $year, '$year:' );
	//( $dateString_start, '$dateString_start:' );
	//logit( $dateTimeObj_start, '$dateTimeObj_start:' );
	//logit( $timestamp_start, '$timestamp_start:' );

	//logit( $dateString_end, '$dateString_end:' );
	//logit( $dateTimeObj_end, '$dateTimeObj_end:' );
	//logit( $timestamp_end, '$timestamp_end:' );


	//$myDate = new DateTime('20140101');

	//$myDateFormat = DateTime::createFromFormat('j-M-Y', '24-Mar-2013');

	//$DateTimestamp = $myDate->getTimestamp();

	//logit($myDate, '$myDate');
	//logit($myDateFormat,'$myDateFormat');
	//logit($DateTimestamp, '$DateTimestamp');

	logit( $gets, '$gets:' );
	logit( $arr, '$arr:' );
	logit( $kywd, '$kywd:' );
	logit( $args, '$args:' );
 ?>

<?php get_footer(); ?>

</div>