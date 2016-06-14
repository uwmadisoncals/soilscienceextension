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
		
			<div id="content" class="fullWidth" role="main">
				
				<?php while ( have_posts() ) : the_post(); ?>

					<?php get_template_part( 'content', 'page' ); ?>

				
				

				<?php endwhile; // end of the loop. ?>
				
				
				<div class="selectorContainer">
					<div class="searchDivider"></div>
				<div class="searchSelector clearfix">
					<a href="#" class="selected simpleS">Simple Search</a><!-- <a href="#" class="advancedS">Advanced Search</a> -->
				</div>
				</div>
			
			 <div class="clearfix advancedSearch" style="display: none;">
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
							</div></div>
				<div class="clearfix simpleSearch">
				<style>
					.filtered2 li {
						display: none;
					}
					
	.filtered2 li.hidden {
		display: none;
	}	
	.filtered2 li.visible {
		display: block;
	}	
	
	.wcmc_hidden {
		display: none;
	}
</style>
<input id="wcmc_s" class="field" type="text" placeholder="General Search" name="wcmc_s">
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script>
			$(function(){		
		
		$(".simpleS").click(function(e) {
			e.preventDefault();
			
			$(".simpleSearch").show();
			$(".advancedSearch").hide();
			
			$(this).addClass("selected");
			$(".advancedS").removeClass("selected");

		});
		
		$(".advancedS").click(function(e) {
			e.preventDefault();
			
			$(".simpleSearch").hide();
			$(".advancedSearch").show();
			
			$(this).addClass("selected");
			$(".simpleS").removeClass("selected");
		});
		
		
		//Regular Expression Search Filter Auto Complete
		$("#wcmc_s").keyup(function () {
			var filter = $(this).val(), count = 0;
			var resultscounted = 0;
			//console.log(filter);
			
		        //console.log("s");    
			$(".filtered2 li").each(function () {
				//console.log($(this).text().search(new RegExp(filter, "i")));
		        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
			        
			        $(this).addClass("hidden"); 
			        $(this).removeClass("visible"); 
			       
			        
		        } else {
				
					
					
			
				
		            $(this).removeClass("hidden");
		            $(this).addClass("visible");
		            
		          
		            
		            count++;
		           
		            
		        }
		    });
		    
		    if(filter == "") {
			    $(".filtered2 li").removeClass("visible"); 
			     $(".filtered2 li").addClass("hidden"); 
		    }
		   
		
		
		   });
		   
		   });
				</script>
				
				<?php $args = array(
									'post_type' => array( 'wcmc' ),
									'posts_per_page' => 500,
									'meta_key' => 'date',
									'orderby' => 'meta_value_num',
									'order' => 'DESC'
									);

					$wcmcfull_query = new WP_Query( $args );

if ( $wcmcfull_query->have_posts() ) { ?>
<div class="filtered2">
	<ul>
	<?php while ( $wcmcfull_query->have_posts() ) {
		$wcmcfull_query->the_post(); ?>
		
		<li>
		<div class="wcmc_shown">
			<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
			<div class="author"><div class="label">Author</div> <?php the_field('author_name1'); ?></div>
			<?php if(get_field('author_name2')) { ?>
			<div class="author"><div class="label">Author</div> <?php the_field('author_name2'); ?></div>
			<?php } ?>
			<?php if(get_field('third_author')) { ?>
			<div class="author"><div class="label">Author</div> <?php the_field('third_author'); ?></div>
			<?php } ?>
			<div class="date"><div class="label">Year</div>
			<?php $myStr = get_field('date'); 
				$result = substr($myStr, 0, 4);
				echo $result;
			 ?>
			</div>
			
		</div>
		
		<div class="wcmc_hidden">
			<div><?php the_content(); ?></div>
			<div><?php the_field('organization'); ?></div>
			<div><?php the_field('title'); ?></div>
			<div><?php the_field('subtitle'); ?></div>
			<div><?php the_field('subject'); ?></div>
			

		
		<?php 
			
			$termids = get_field('keywords');
			
			if($termids) {
			
			//echo $termid;
// no default values. using these as examples
$taxonomies = array( 
   
    'wcmc_keywords',
);

$args = array(
    'orderby'           => 'name', 
    'order'             => 'ASC',
    'hide_empty'        => false, 
    'exclude'           => array(), 
    'exclude_tree'      => array(), 
    'include'           => $termids,
    'number'            => '', 
    'fields'            => 'all', 
    'slug'              => '',
    'name'              => '',
    'parent'            => '',
    'hierarchical'      => true, 
    'child_of'          => 0, 
    'get'               => '', 
    'name__like'        => '',
    'description__like' => '',
    'pad_counts'        => false, 
    'offset'            => '', 
    'search'            => '', 
    'cache_domain'      => 'core'
); 

$terms = get_terms($taxonomies, $args);

if( $terms ): 

	

	 foreach( $terms as $term ): ?>

		<div><?php echo $term->name; ?></div>
		

	<?php endforeach; ?>

	

<?php endif; } ?>




		</div>
		
		</li>
	<?php }

} else {
	// no posts found
}


 ?>
 
	</ul>
</div>
				</div>
			</div><!-- #content -->
			
			
			
		</div><!-- #primary -->
		<?php //get_sidebar(); ?>
			<div class="clear"></div>

	</div>
<?php get_footer(); ?>

</div>