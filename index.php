<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 * @package WordPress
 * @subpackage CALSv1
 */

get_header(); ?>

<?php include_once(ABSPATH . WPINC . '/feed.php');




$rss = fetch_feed(array(
	'http://www.rssmix.com/u/8167593/rss.xml',	));

if(! is_wp_error($rss)):

	$maxitems=$rss->get_item_quantity(6);

	$rss_items= $rss->get_items(0,$maxitems);

	$rss->enable_order_by_date(true);
endif;

?>



  <div class="collegeFeature2">
  <?php if (function_exists( 'muneeb_ssp_slider')) {muneeb_ssp_slider( 109 );} ?>
   </div>



  <div id="main">

		<div id="primary">
			<!-- Will be removed -->
			<div class="newsItem customize" style="display:none;">
			<span class="number">1</span>
			<div class="hiddendate">-9999999999</div>
    	<div class="categories">
	  		<div class="topics">
		  		<ul>


	    	<?php
$categories = get_categories();
foreach ($categories as $cat) {

if($cat->cat_name != 'Uncategorized') {
echo '<li><a href="#" data-cat="'.$cat->slug.'" class="selected categor">'.$cat->cat_name.'</a></li>';
}

}
?>
					<!--<li><a href="#" data-cat="Agriculture" class="selected agriculture categor"><span></span>Agriculture</a><a href="http://news.cals.wisc.edu/category/agriculture/" style="display: none;" class="more">See More</a></li>
					<li><a href="#" data-cat="Announcements" class="selected announcements categor"><span></span>Announcements</a><a href="http://news.cals.wisc.edu/category/highlights/" style="display: none;" class="more">See More</a></li>
			    	<li><a href="#" data-cat="Energy" class="selected energy categor"><span></span>Energy</a><a href="http://news.cals.wisc.edu/category/energy/" style="display: none;" class="more">See More</a></li>
			    	<li><a href="#" data-cat="Environment" class="selected environment categor"><span></span>Environment</a><a href="http://news.cals.wisc.edu/category/environment/" style="display: none;" class="more">See More</a></li>
			    	<li><a href="#" data-cat="Events" class="selected events categor"><span></span>Events</a><a href="http://twitter.com/uwmadisoncals" style="display: none;" class="more">See More</a></li>
			    	<li><a href="#" data-cat="Food" class="selected food categor"><span></span>Food</a><a href="http://ecals.cals.wisc.edu/category/food-2/" style="display: none;" class="more">See More</a></li>
			    	<li><a href="#" data-cat="Health" class="selected health categor"><span></span>Health</a><a href="http://news.cals.wisc.edu/category/health/" style="display: none;" class="more">See More</a></li>
			    	<li><a href="#" data-cat="People" class="selected people categor"><span></span>People</a><a href="http://ecals.cals.wisc.edu/category/people/" style="display: none;" class="more">See More</a></li>
			    	<li><a href="#" data-cat="social" class="selected social categor"><span></span>Social</a><a href="http://twitter.com/uwmadisoncals" style="display: none;" class="more">See More</a></li>
			    	-->
		  		</ul>
	  		</div>


		  	<div class="categoriesSort">
		    	 <ul id="sort" class="option-set clearfix" data-option-key="sortBy">
			    	<!--<li><a href="#" data-cat="number">Highlighted</a></li>-->
			        <li><a href="#" data-cat="chronological" class="selected">Chronological</a></li>

			        <li><a href="#" data-cat="alphabetical">Alphabetical</a></li>
			        <li><a href="#" data-cat="grouped">Grouped</a></li>
		  		</ul>
		  	</div>

	  		<a href="#" class="remembersettings selected" data-rem="yes">Remember My Settings</a>

  		</div>
    </div>

			<?php $options = twentyeleven_get_theme_options();
$current_layout = $options['theme_layout'];
//$current_colorscheme = $options['link_color'];



if ( 'content' != $current_layout ) : ?>
	<div id="content" role="main">
    <?php if ( have_posts() ) : ?>

				<?php twentyeleven_content_nav( 'nav-above' ); ?>

				<?php /* Start the Loop */ ?>
				<?php while ( have_posts() ) : the_post(); ?>

					<?php get_template_part( 'content', get_post_format() ); ?>

				<?php endwhile; ?>

				<?php twentyeleven_content_nav( 'nav-below' ); ?>

			<?php else : ?>

				<article id="post-0" class="post no-results not-found">
					<header class="entry-header">
						<h1 class="entry-title"><?php _e( 'Nothing Found', 'twentyeleven' ); ?></h1>
					</header><!-- .entry-header -->

					<div class="entry-content">
						<p><?php _e( 'Apologies, but no results were found for the requested archive. Perhaps searching will help find a related post.', 'twentyeleven' ); ?></p>
						<?php get_search_form(); ?>
					</div><!-- .entry-content -->
				</article><!-- #post-0 -->

			<?php endif; ?>

<?php endif; ?>


		<?php if ( 'content' == $current_layout ) : ?>
			<div class="loadBar">
	<div class="progress"></div>
</div>
		<!--<div class="centeredContainerInset topspace">

  <h2 class="sectionTitle">Highlights</h2>
  </div>-->








			<div id="content" role="main">
			<div id="container" style="opacity: 0;" class="super-list variable-sizes clearfix">





   		<?php	if ( is_home() ) { query_posts( 'showposts=9' ); } ?>

			<?php if ( have_posts() ) : ?>

				<?php //twentyeleven_content_nav( 'nav-above' ); ?>

				<?php /* Start the Loop */ ?>
				<?php while ( have_posts() ) : the_post(); ?>






	<div class="newsItem fakeClass <?php $category = get_the_category();
echo $category[0]->slug; ?>">

    		<div class="previousa">
    		<div class="additionalContent">



    				<?php

	    				if ( has_post_thumbnail() ) {

		    				//the_post_thumbnail();
		    				echo get_the_post_thumbnail($page->ID, 'large');

		    				} else {

							 //echo '<img src="';
							 echo catch_that_image();
							// echo '" alt="" />';

						}

    				?>


    		</div>

    		<div class="text">
    			<div class="glyph"><div class="symbol"></div></div>
    			<div class="titleheading">
    			<div class="categoryItem"><?php
					$category = get_the_category();
					echo $category[0]->cat_name;
					?></div>
    			<h3><?php the_title(); ?></h3>
    			</div>
    			<div class="excerpt">


			<?php the_content_rss('', FALSE, '', 180); ?>


    			</div>
    			<div class="dateheading">
    			<?php the_date(); ?>
    			</div>
    			<div class="hiddendate"><?php echo "-"; the_time('Ymd') ?></div>
    			<div class="hiddengroup"><?php $category = get_the_category();
echo $category[0]->slug; ?></div>


					<span class="number">10</span>
    		</div>

    		<a href="<?php the_permalink(); ?>" class="highlight">
	    		<div class="loadingSpinner" style="display: none;">
	    			<div class="progress" style="width:100%;"></div>
	    		</div>
    		</a>
    	</div>

    </div>

				<?php endwhile; ?>



				<!--
				<?php



                            //Get sticky news post
							$sticky_posts = cals_fetch_feed('http://news.cals.wisc.edu/feed/?cat=-20%2C-21%2C-66%2C-67&tag=cals-home-sticky&post_thumb=1', 1, 0, 64);

							foreach ($sticky_posts as $sticky_post){
								//print_r($sticky);
								$postmeta = $sticky_post->get_item_tags('http://wordpress.org/export/1.0/', 'postmeta');
								$profile_thumbnail = $postmeta[0]['child']['http://wordpress.org/export/1.0/']['meta_value'][0]['data'];

								//$featuredImageSrc = $sticky_post->get_item_tags('', 'featuredImage');


								//$featuredImage = $featuredImageSrc[0]['data'];


								$sticky_post_id = $sticky_post->get_id();
								?>


								<div class="newsItem <?php //$category = get_the_category(); echo $category[0]->slug; ?>">
    	<a href="<?php echo $sticky_post->get_permalink();?>" title = "Permanent link to <?php echo $sticky_post->get_title(); ?>">
    		<div class="text">
    			<div class="glyph"><div class="symbol"></div></div>
    			<div class="titleheading">
    			<h3><?php echo $sticky_post->get_title(); ?></h3>
    			</div>
    			<div class="excerpt">


			<?php //echo $sticky_post->get_content(); ?>
    			<?php
                    $content = $sticky_post->get_content();

							echo substr($content,0,110).'...';


					?>

    			</div>
    			<div class="dateheading">
    			<?php echo $sticky_post->get_date('F j, Y'); ?>

    			</div>

					<span class="number">10</span>
    		</div>
    		<div class="additionalContent">

    				<?php //echo get_the_post_thumbnail($page->ID, 'large'); ?>

    				<?php
	    				/*if ( get_the_post_thumbnail($post_id) != '' ) {

		    				echo get_the_post_thumbnail($page->ID, 'large');

		    				} else {

							 echo '<img src="';
							 echo catch_that_image();
							 echo '" alt="" />';

						}*/

    				?>

    				<?php


											if ($profile_thumbnail!='') {?>
												<?php echo $profile_thumbnail;?>
											<?php } else {
												//get generic default image (attachment_id = 32)
												echo wp_get_attachment_image('232', array(300,300));
											}

										?>







    		</div>

    		<div class="highlight"></div>
    	</a>
    </div>



							<?php }


							//print_r($sticky_post);

							?>-->

							<?php
								//get news from eCALS
								//cals_fetch_feed2('http://ecals.cals.wisc.edu/?cat=-356,-384,-385,-363,-358,-366,-355&feed=rss2', 4, 1, -1);

								//get news from CALS News
								//cals_fetch_feed2('http://news.cals.wisc.edu/?feed=rss2&cat=-20,-21,-66,-67,0', 4, 1, -1);





								//cals_get_last_tweet();
							?>
							<?php get_sidebar( 'homepage' ); ?>
				<?php //twentyeleven_content_nav( 'nav-below' ); ?>

			<?php else : ?>

				<article id="post-0" class="post no-results not-found">
					<header class="entry-header">
						<h1 class="entry-title"><?php _e( 'Nothing Found', 'twentyeleven' ); ?></h1>
					</header><!-- .entry-header -->

					<div class="entry-content">
						<p><?php _e( 'Apologies, but no results were found for the requested archive. Perhaps searching will help find a related post.', 'twentyeleven' ); ?></p>
						<?php get_search_form(); ?>
					</div><!-- .entry-content -->
				</article><!-- #post-0 -->

			<?php endif; ?>

	<?php endif; ?>

</div>

<!--<div class="centeredContainerInset topspace mobilemargin">

  <h2 class="sectionTitle">About CALS</h2>
  </div>
<div class="aboutCALSMission">
	<div class="inner">
		<div class="column">
		<p>Located at the heart of the University of Wisconsin-Madison campus, the College of Agricultural and Life Sciences (CALS) is one of the oldest and most prestigious colleges devoted to the study of our living world.</p>


<a href="#" class="button">Learn more about the college’s history</a>
		</div>
	</div>
</div>-->
			</div><!-- #content -->

<?php get_sidebar(); ?>

<!--/////////////////////////////////////////////////////////////////////////////////////-->
<!--            WORK IN PROGRESS, NEWS for FRONT PAGE....Temporarily Commented out       -->
<!--/////////////////////////////////////////////////////////////////////////////////////-->

	<div class="news_heading_wrapper"><h2 class="news_heading">News</h2></div>
	<div class="news_container cf">

	<?php

	$threeMoAgo = date('Y-m-d', strtotime('-3 month'));

	$argsNews = array(
		'post_type'=>'post',
		'posts_per_page'=>'3',
		'category_name'=>'news',
		'orderby'=>'date',
		'order'=>'DESC',
	/*	'date_query'=>array(
			array(
				'after'=>$threeMoAgo
				)
			),*/
		);

		$newsQuery = new WP_Query($argsNews);
	?>

		<?php

		if($newsQuery->have_posts() ):

		while ($newsQuery->have_posts() ) : $newsQuery->the_post(); ?>


	   <div class="news_item">
						<div class="news_item_inner">
							<div class="news_hyperlink"><a class="news_feed" href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a></div>
							<div class="news_date"><p><span class="news_author"><a href="" title="<?php the_author(); ?>" ><?php the_author(); ?></a></span>,  <?php the_time('M j, Y'); ?></p></div>
							<div class="news_desc"><?php the_excerpt(); ?></div>
						</div> <!-- END .news_item_inner -->
		</div><!-- END .news_item -->


		<?php  endwhile ?><!-- from the loop-->

		<?php else : ?>

				<!-- This is displayed when no matching posts are available-->
			   <div class="noNews">
						<p>Unfortunately no news is available.</p>
				</div><!-- END .noNews_item -->

			<?php  endif ?><!-- from the loop-->
			<?php //logit($newsQuery->posts, '$newsQuery->posts: ');

			 ?>
		<?php  wp_reset_query(); ?>



		<div class="rss_heading_wrapper"><h2 class="rss_heading">Recent Articles from our Extension Soil Scientists</h2></div>
		<div class="rss_container cf">
			<?php if($maxitems ==0): ?>
				<li><?php _e('No items') ?></li>
				<?php else: ?>
					<?php  foreach ($rss_items as $item) : ?>
						<div class="rss_item">
							<div class="rss_item_inner">

								<div class="rss_hyperlink"><a class="rss_feed" href="<?php echo esc_url($item->get_permalink() ); ?>" title="<?php printf( __('Posted %s'), $item->get_date('j F Y | g:i a')); ?>"><?php echo esc_html($item->get_title()); ?></a></div>
								<!-- <p><?php  $rssArray[] = strtotime($item->get_date('Y-m-d H:i:s'));
								arsort($rssArray);?>
								</p> -->
								<div class="rss_date"><p><?php echo $item->get_date('l, F j, Y'); ?></p></div>
								<?php /* print_r($item); */ ?>
								<?php /*echo $item->get_description();  */?>
								<div class="rss_desc"><?php echo shortenSimplePie($item->get_description(),150);  ?></div>
							</div>
						</div>
					<?php endforeach; ?>


			<?php endif; ?>
		</div>



	 </div><!--END .news_container -->

<!--/////////////////////////////////////////////////////////////////////////////////////-->
<!--/////////////////////////////////////////////////////////////////////////////////////-->


</div><!-- #primary -->





<?php /*logit( $rssArray, '$rssArray:' ); */?>
<?php /*logit( $rss_items, '$rss_items:');*/ ?>
<?php /* logit( $sortd_rssArray, '$sortd_rssArray:'  ); */ ?>
<?php get_footer(); ?>
