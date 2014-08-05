<?php
/**
 *
 * The Sidebar containing the main widget area.
 * @package WordPress
 * @subpackage CALSv1
 * @since CALS 1.0
 */

$options = twentyeleven_get_theme_options();
$current_layout = $options['theme_layout'];




if ( 'content' != $current_layout ) :
?>
		<div id="secondary" class="widget-area" role="complementary">
		
			<?php if ( !is_home() ) { get_template_part('nav_menu', 'sidebar');  } ?>
			
			<?php //get_template_part('nav_side', 'promo'); ?>
			
			
		
			<?php if ( ! dynamic_sidebar( 'sidebar-1' ) ) : ?>

				<aside id="archives" class="widget">
					<h3 class="widget-title"><?php _e( 'Archives', 'twentyeleven' ); ?></h3>
					<ul>
						<?php wp_get_archives( array( 'type' => 'monthly' ) ); ?>
					</ul>
				</aside>

				<aside id="meta" class="widget">
					<h3 class="widget-title"><?php _e( 'Meta', 'twentyeleven' ); ?></h3>
					<ul>
						<?php wp_register(); ?>
						<li><?php wp_loginout(); ?></li>
						<?php wp_meta(); ?>
					</ul>
				</aside>

			<?php endif; // end sidebar widget area ?>
		</div><!-- #secondary .widget-area -->
<?php endif; ?>

<?php if ( 'content' == $current_layout ) : if ( !is_home() ) {
    // This is not the homepage
 ?>
	
	<?php if(is_search()) { ?>
		
	<div class="searchSidebar">
		<?php
		//cals_uw_directory_search($small=true, $add_class = 'search_results_side'); ?>

			<?php  if (function_exists('cals_uw_directory_search')){
			cals_uw_directory_search($small=true, $add_class = 'search_results_side');
			}
			else{
				//exit;
			}
			?>
		
		
		
		<!-- SEARCH FORM -->
		<?php /*
<div class="googleSearch">
<h4>Google Found</h4>
<form action="http://www.google.com/search" method="get">

<!-- HTML5 SEARCH BOX!  -->
<input type="search" id="search-box" name="q" results="5" autocomplete="on" />
<!-- SEARCH BUTTON -->
<input id="search-submit" type="submit" value="Search" />
<div id="search-area" style="position:relative;">
<div id="search-results">
<div id="search-results-pointer"></div>
<div id="search-results-content"></div>
</div>
</div>
 
</form>
</div> */?>

</div>

		
	 <?php } else {  ?>
			
	 <?php get_template_part('nav_menu', 'sidebar');  ?>
	 <?php get_template_part('nav_side', 'promo'); ?>
	 <?php } ?>
	
	
	
	<!--<div id="secondary" class="widget-area" role="complementary">
			
			
			<?php if ( ! dynamic_sidebar( 'sidebar-1' ) ) : ?>
				
				
				
				<aside id="archives" class="widget">
					<h3 class="widget-title"><?php _e( 'Archives', 'twentyeleven' ); ?></h3>
					<ul>
						<?php wp_get_archives( array( 'type' => 'monthly' ) ); ?>
					</ul>
				</aside>

				<aside id="meta" class="widget">
					<h3 class="widget-title"><?php _e( 'Meta', 'twentyeleven' ); ?></h3>
					<ul>
						<?php wp_register(); ?>
						<li><?php wp_loginout(); ?></li>
						<?php wp_meta(); ?>
					</ul>
				</aside>

			<?php endif; // end sidebar widget area ?>
		</div>--><!-- #secondary .widget-area -->

<?php } endif; ?>