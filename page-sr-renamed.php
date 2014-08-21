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


// Variables related to Date comparison
				$year = $arr["year"];
				$dateString_start = $year.'0101'; 
				$dateTimeObj_start = new DateTime($dateString_start);
				$timestamp_start = $dateTimeObj_start->getTimestamp();
				
				$dateString_end = $year.'1231';
				$dateTimeObj_end = new DateTime($dateString_end);
				$timestamp_end = $dateTimeObj_end->getTimestamp();

//accepts $gets array filters out unset values, updates $arr
foreach ($gets as $key=>$val){
	if(isset($val)){
		$arr[$key]=$val;
	}
}

	switch($arr){
		case (isset($arr["year"]) && isset($arr["subject"])):
				$searchType ="year and subject";
				//$year=intval($arr["year"]);
			
				$subj=$arr["subject"];

					$args = array(
			'numberposts' => -1,
			'post_type' => 'wcmc',
			'meta_query' => array(
									'relation' => 'AND',
											array(
												'key' => 'date', //gets ACF value assoc with 'date'
												'compare' => 'BETWEEN',
												//'value' => $year // gets value from $arr, which gets value from dropdown
												'meta_value' => array($timestamp_start, $timestamp_end)
												),
											array(
												'key' => 'subject',
												'value' => $subj,
												'compare' => '='
											)
								)
				); 
		break; 

		case (isset($arr["year"]) && isset($arr["author"])):
		$searchType ="year and author";

		$year=intval($arr["year"]);
		$author=$arr["author"];

					$args = array(
			'numberposts' => -1,
			'post_type' => 'wcmc',
			'meta_query' => array(
									'relation' => 'AND',
											array(
												'key' => 'date', //gets ACF value assoc with 'date'
												'compare' => '=',
												'value' => $year //val of dropdown
											),
											array(
												'key' => 'author_name1', //gets ACF value assoc with 'author_name1'
												'value' => $author, // gets value from $arr, which gets value from dropdown
												'compare' => '='
											)
								)
				); 
		//print_r("year and author");
		break;

		case (isset($arr["keyword"])):
		$searchType ="keyword";

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

	

	//############################################
	//#############    FIREPHP  ##################
 	/*

	$firephp = FirePHP::getInstance(true);
	 
	$var = $arr;
	$var2 = $author;
	$var3= $year;
	$var4 = $args;
	$var5 = $auth;
	$var6 = $gets;
	$var7 = $kywd;
	$var8 = $getTerms;
	$var9 = $name_getTerms;



	$firephp->log($var6,'$gets');
	$firephp->log($var,'$arr');
	//$firephp->log($var2,'$author');
	//$firephp->log($var3,'$year');
	//$firephp->log($var5,'$auth');
	$firephp->log($var7,'$kywd');
	$firephp->log($var4,'$args');
	$firephp->log($var8,'$getTerms');
	$firephp->log($var,'$name_getTerms');
*/
	
	
	//############################################
	//############################################
	 ?>

<?php get_footer(); ?>

</div>