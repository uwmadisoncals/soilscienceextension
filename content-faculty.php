<?php 	$image = get_field('photo'); ?>

<div class="faculty_wrapper">
							<div class='faculty_photo'>

							<?php 
								if($image):
									echo '<img src="' . $image['url'] . '" alt="' . $image['alt'] .  '"/>';
								else:
									echo '<img width="140" src="' . get_stylesheet_directory_uri()."/images/avatarplaceholder.jpg" . '" alt="' . $image['alt'] .  '"/>';
								endif;
							 ?>
							 
							</div>
							<div class="faculty_info">
								<h2><?php the_title(); ?></h2>
								<?php
									//GET THE FIELD OBJECTS
									$get_FO_proTitle = get_field_object('professional_title'); 
									$get_FO_dept = get_field_object('department');
									$get_FO_edu = get_field_object('education');
									$get_FO_address = get_field_object('address');
									$get_FO_email = get_field_object('email');
									$get_FO_phone = get_field_object('phone');
									$get_FO_fax = get_field_object('fax');

									//GET THE LABELS FOR EACH FIELD OBJECT
									$proTitle_label = $get_FO_proTitle['label'];
									$dept_label = $get_FO_dept['label'];
									$edu_label = $get_FO_edu['label'];
									$address_label = $get_FO_address['label'];
									$email_label = $get_FO_email['label'];
									$phone_label = $get_FO_phone['label'];
									$fax_label = $get_FO_fax['label'];

								 ?>
								
								<li><span><?php echo $proTitle_label; ?>: </span><?php the_field( 'professional_title' ); ?></li>
								<li><span><?php echo $dept_label; ?>: </span><?php the_field( 'department' ); ?></li>
								<li><span><?php echo $edu_label; ?>: </span><?php the_field( 'education' ); ?></li>
								<li><span><?php echo $address_label; ?>: </span><?php the_field( 'address' ); ?></li>
								<li><span><?php echo $email_label; ?>: </span><a href="mailto:<?php the_field( "email" ); ?>"><?php the_field( "email" ); ?></a></li>
								<li><span><?php echo $phone_label; ?>: </span><?php the_field( 'phone' ); ?></li>
								<li><span><?php echo $fax_label; ?>: </span><?php the_field( 'fax' ); ?></li>

							</div><!--END .faculty_info -->
							<div class="cf"></div>
							<div class="detail_info">
								<div><h3>Overview: </h3><?php the_field( 'overview' ); ?></div>
								<div><h3>Publications: </h3><?php the_field( 'publications' ); ?></div>
							</div><!-- END .detail_info -->
						</div><!-- END .faculty_wrapper -->