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

get_header(); ?>


	<div id="main">

		<div id="primary">
		
			<div id="content" role="main">
			<?php get_template_part('wcmc','searchform') ?>
			 <?php echo site_url(); ?> 
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