
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
									'numberposts'=>-1,
									'post_type' => 'faculty',
									'meta_key'=>'employee_type',
									'meta_value'=>'faculty'
									);


				$the_query = new WP_Query($args);

				?>

				<?php if( $the_query->have_posts() ): ?>
					<ul>
					<?php while ( $the_query->have_posts() ) : $the_query->the_post(); 
					$image = get_field('photo');
					?> <div class="faculty_wrapper">
							<div class='faculty_photo'>
								<a href="<?php the_permalink(); ?>?id=<?php echo get_the_ID(); ?>"><img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" ></a>
							</div>

							<div class="faculty_info">
								<li>
									<a class="faculty_name" href="<?php the_permalink(); ?>?id=<?php echo get_the_ID(); ?>"><?php the_title(); ?></a>
								</li>
								
								<li>
									<span><?php 
									$get_FO_dept = get_field_object('department');
									//logit( $get_FO_dept, '$get_FO_dept:' );
									$dept_label = $get_FO_dept['label'];
									//logit( $dept_label, '$dept_label:' );
									/* echo get_field_object('department')['label']; ?>: </span><?php the_field( "department" ); */
									echo $dept_label; ?>: </span><?php the_field( "department" ); ?>
								</li>

								<li>
									<span><?php 
									$get_FO_email = get_field_object('email');
									$email_label = $get_FO_email['label'];


									 /* echo get_field_object('email')['label']; ?>: </span><a href="mailto:<?php the_field( "email" ); ?>"><?php the_field( "email" ); ?></a> */

									echo $email_label ?>: </span><a href="mailto:<?php the_field( "email" ); ?>"><?php the_field( "email" ); ?></a>


								</li>

								<li>
									<span><?php 
									$get_FO_phone = get_field_object('phone');
									$phone_label = $get_FO_phone['label'];

									//logit( $get_FO_phone, '$get_FO_phone:' );
									//logit( $phone_label, '$phone_label:' );
									
									/* echo get_field_object('phone')['label']; ?>: </span><?php the_field( "phone" ); ?> */

									echo $phone_label; ?>: </span><?php the_field( "phone" ); ?>

								</li>
							</div>
							<div class="cf"></div>
						</div>
						
					<?php endwhile; ?>
					</ul>
				<?php endif; ?>
				<?php wp_reset_query();  // Restore global post data stomped by the_post(). ?>
				

				<?php //get_template_part( 'content', 'page' ); ?>


				<!-- -->
				<div>
				<hr>
				<h2 class="staff-title">STAFF</h2><hr></div>
				<?php


				$argsSTAFF = array(
									'numberposts'=>-1,
									'post_type' => 'faculty',
									'meta_key'=>'employee_type',
									'meta_value'=>'staff'
									);


				$the_querySTAFF = new WP_Query($argsSTAFF);

				?>

				<?php if( $the_querySTAFF->have_posts() ): ?>
					<ul>
					<?php while ( $the_querySTAFF->have_posts() ) : $the_querySTAFF->the_post(); 
					$image = get_field('photo');
					?> <div class="faculty_wrapper">
							<div class='faculty_photo'>
								<a href="<?php the_permalink(); ?>?id=<?php echo get_the_ID(); ?>"><img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" ></a>
							</div>

							<div class="faculty_info">
								<li>
									<a class="faculty_name" href="<?php the_permalink(); ?>?id=<?php echo get_the_ID(); ?>"><?php the_title(); ?></a>
								</li>
								
								<li>
									<span><?php 
									$get_FO_dept = get_field_object('department');
									//logit( $get_FO_dept, '$get_FO_dept:' );
									$dept_label = $get_FO_dept['label'];
									//logit( $dept_label, '$dept_label:' );
									/* echo get_field_object('department')['label']; ?>: </span><?php the_field( "department" ); */
									echo $dept_label; ?>: </span><?php the_field( "department" ); ?>
								</li>

								<li>
									<span><?php 
									$get_FO_email = get_field_object('email');
									$email_label = $get_FO_email['label'];


									 /* echo get_field_object('email')['label']; ?>: </span><a href="mailto:<?php the_field( "email" ); ?>"><?php the_field( "email" ); ?></a> */

									echo $email_label ?>: </span><a href="mailto:<?php the_field( "email" ); ?>"><?php the_field( "email" ); ?></a>


								</li>

								<li>
									<span><?php 
									$get_FO_phone = get_field_object('phone');
									$phone_label = $get_FO_phone['label'];

									//logit( $get_FO_phone, '$get_FO_phone:' );
									//logit( $phone_label, '$phone_label:' );
									
									/* echo get_field_object('phone')['label']; ?>: </span><?php the_field( "phone" ); ?> */

									echo $phone_label; ?>: </span><?php the_field( "phone" ); ?>

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