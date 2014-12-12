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
				
				<?php while ( have_posts() ) : the_post(); ?>

					<?php get_template_part( 'content', 'page' ); ?>

				
				

				<?php endwhile; // end of the loop. ?>
				
			<?php// get_template_part('wcmc','searchform') ?>
			 
			<?php 
 
				// args
				$args = array(
					'posts_per_page' => 1,
					'post_type' => 'wcmc'
					//'orderby' => 'meta_value_num',
					//'order' => 'ASC'
				);
				 
				// get results
				$the_query = new WP_Query( $args );
				 
				// The Loop
				?>
				<?php if( $the_query->have_posts() ): ?>
					
					<?php while ( $the_query->have_posts() ) : $the_query->the_post(); 
							$select = get_field_object('subject'); //get the select field object 'subject'
							$choices = $select['choices']; //get the choices for 'subject'
							//$selct_val = get_field('subject');
							//$choice_array = array();

							/*foreach($choices as $ch){

								logit($ch,'$ch: ');
							}*/
							?>


							<div class="wcmc-search" rol="search">

							    <h2 class="widget-title">Advanced Searchform</h2>
							    <br />

							    <p>Search by year and subject:</p>
								

								<form role="search" class="wcmc-form" action="<?php echo site_url('/sr'); ?>" method="GET" name="yearsubject">

									<select id="yearselect" class="yearselect" name="yr">
										<option value="2014" name="yr">2014</option>
										<option value="2013" name="yr">2013</option>
										<option value="2012" name="yr">2012</option>
										<option value="2011" name="yr">2011</option>
										<option value="2010" name="yr">2010</option>
										<option value="2009" name="yr">2009</option>
										<option value="2008" name="yr">2008</option>
										<option value="2007" name="yr">2007</option>
										<option value="2006" name="yr">2006</option>
										<option value="2005" name="yr">2005</option>
										<option value="2004" name="yr">2004</option> 

									</select>

									<select name="subject">
										 <!-- <option value="nutrient management" name="subject">Nutrient Management</option>
										<option value="insects and disease" name="subject">Insects and Disease</option>
										<option value="weed management" name="subject">Weed Management</option>
										<option value="vegetable management" name="subject">Vegetable Management</option>
										<option value="forages" name="subject">Forages</option>
										<option value="grain topics" name="subject">Grain Topics</option>
										<option value="soil, water and climate" name="subject">Soil, Water and Climate</option>
										<option value="manure" name="subject">Manure</option>
										<option value="agriculture business" name="subject">Ag Business</option>
										<option value="agriculture regulation" name="subject">Ag Regulation</option>
										<option value="genetics" name="subject">Genetics</option>
										<option value="all subjects" name="subject">ALL SUBJECTS</option>-->

											<?php /*
												foreach($choices as $ch){

														logit($ch,'$ch: ');
														echo '<option value="' . $ch . '" name="subject">' . $ch . '</option>';
													}
											*/ ?>
												<?php
						

												foreach($choices as $ch=>$val){

														//logit($val,'$val: ');
														echo  $val .' ';
														//array_search($val,$choices);
														//logit(array_search($val,$choices), 'ch: ');
														echo '<option value="' . array_search($val,$choices) . '" name="subject">' . $val . '</option>';

													}

											 ?>

									</select>

									<input type="submit" name="submit" alt="Search" value="Go" />
										
								</form>
								<br />

								<p>Search by year and author:</p>
								<form role="search" class="wcmc-form" action="<?php echo site_url('/sr'); ?>" method="GET" name="authorsearch">
									<select class="yearselect" name="yr">
										<option value="2014" name="yr">2014</option>
										<option value="2013" name="yr">2013</option>
										<option value="2012" name="yr">2012</option>
										<option value="2011" name="yr">2011</option>
										<option value="2010" name="yr">2010</option>
										<option value="2009" name="yr">2009</option>
										<option value="2008" name="yr">2008</option>
										<option value="2007" name="yr">2007</option>
										<option value="2006" name="yr">2006</option>
										<option value="2005" name="yr">2005</option>
										<option value="2004" name="yr">2004</option>

									</select>
									<input id="yearAuthorField" type="text" name="auth" size="20" alt="Search" value="" />
									<input type="submit" name="submit" alt="Search" value="Go" />
								</form>

								<br />

								
								<p>Search all years by keyword:</p>
								<form id="access" class="wcmc-form" action="<?php echo site_url('/sr'); ?>" method="GET">
									<div id="ac_input_wrapper">
									<input id="autocomplete1" type="text" value="" size="20" name="keyword">
									<input id="autocomplete1_submit" type="submit" value="Go" name="submit">
									</div>
									<div class="autoc filtered"><ul></ul></div>
								</form>
							<div>
						
							</div>
							
						
				
							
							<?php //$get_auth_name = gettype(get_field( "author_name1" ));
								$getTerms=get_the_terms($post_ID,'wcmc_keywords');
							 ?>

							<?php 
								//logit(	$choices , '	$choices :');
								//logit(	$select , '	$select :');
						//logit(	$selct_val , '	$selct_val :');
						//logit(	$choice_array , '	$choice_array :');
									//############################################
									//#############    FIREPHP  ##################
								 	/*

									$firephp = FirePHP::getInstance(true);
									 
									$var99 = $get_auth_name;
									$var33 = $tterm;
									
									$var88 = $getTerms;
									


									 
									//$firephp->log($var99,'$get_auth_name');
									$firephp->log($var33,'$tterm');
									
									$firephp->log($var88,'$getTerms');
									


									*/
									//############################################
									//############################################
							 ?>


						
					<?php endwhile; ?>
				
				<?php endif; ?>
				 
				<?php wp_reset_query();  // Restore global post data stomped by the_post(). ?>
				
			</div><!-- #content -->
			
			
			
		</div><!-- #primary -->
		<?php get_sidebar(); ?>
			<div class="clear"></div>

	</div>
<?php get_footer(); ?>

</div>