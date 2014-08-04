
<?php
/**
 * Template Name: No Side Bar
 *
 * Description: Twenty Twelve loves the no-sidebar look as much as
 * you do. Use this page template to remove the sidebar from any page.
 *
 * Tip: to remove the sidebar from all posts and pages simply remove
 * any active widgets from the Main Sidebar area, and the sidebar will
 * disappear everywhere.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
 

get_header(); ?>


	<div id="main">

		<div id="primary">
		
			<div id="content" class="fullWidth" role="main">

				<?php

				$args = array(
					'post_type' => 'faculty'
					);

				$the_query = new WP_Query($args);

				?>

				<?php if( $the_query->have_posts() ): ?>
					<ul>
					<?php while ( $the_query->have_posts() ) : $the_query->the_post(); 
					$image = get_field('photo');
					?> <div class="faculty_wrapper">
							<div class='faculty_photo'>
								<img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" />
							</div>

							<div class="faculty_info">
								<li>
									<a class="faculty_name" href="<?php the_permalink(); ?>?id=<?php echo get_the_ID(); ?>"><?php the_title(); ?></a>
								</li>
								
								<li>
									<span>Department: </span><?php the_field( "department" ); ?>
								</li>

								<li>
									<span>Email: </span><a href="mailto:<?php the_field( "email" ); ?>"><?php the_field( "email" ); ?></a>
								</li>

								<li>
									<span>Phone: </span><?php the_field( "phone" ); ?>
								</li>
							</div>
							<div class="cf"></div>
						</div>
						
					<?php endwhile; ?>
					</ul>
				<?php endif; ?>
				<?php wp_reset_query();  // Restore global post data stomped by the_post(). ?>
				

				<?php //get_template_part( 'content', 'page' ); ?>
			</div><!-- #content -->
			<?php //get_sidebar(); ?>
			<div class="clear"></div>
			
		</div><!-- #primary -->

	</div>
<?php get_footer(); ?>

</div>