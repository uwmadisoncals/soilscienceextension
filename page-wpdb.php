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
			
			<?php wcmc_ajax(); ?>

						<div id="formWrap">
						    <form id="messageForm" action="#">
						        <fieldset>
						            <legend>New message form</legend>
						            <span>New Message</span>
						            <label id="toLabel">To:</label>
						            <div id="friends" class="ui-helper-clearfix">
						                <input id="to" type="text">
						            </div>
						            <label>Subject:</label>
						            <input id="subject" name="subject" type="text">
						            <label>Message:</label>
						            <textarea id="message" name="message" rows="5" cols="50"></textarea>
						            <button type="button" id="cancel">Cancel</button>
						            <button type="submit" id="send">Send</button>
						        </fieldset>
						    </form>
						</div>
						<p><?php echo get_template_directory() ?>  </p>
						<!--<script type="text/javascript">
						    $(function(){
						             
						        //attach autocomplete
						        $("#to").autocomplete({
						                     
						            //define callback to format results
						            source: function(req, add){
						                     
						                //pass request to server
						                $.getJSON("<?php bloginfo('template_directory') ?>/wcmcAJAX2.php?callback=?", req, function(data) {
						                             
						                    //create array for response objects
						                    var suggestions = [];
						                             
						                    //process response
						                    $.each(data, function(i, val){                              
						                    suggestions.push(val.name);
						                });
						                             
						                //pass array to callback
						                add(suggestions);
						            });
						        },
						                     
						        //define select handler
						        select: function(e, ui) {
						                         
						            //create formatted friend
						            var friend = ui.item.value,
						                span = $("<span>").text(friend),
						                a = $("<a>").addClass("remove").attr({
						                    href: "javascript:",
						                    title: "Remove " + friend
						                }).text("x").appendTo(span);
						                         
						                //add friend to friend div
						                span.insertBefore("#to");
						            },
						                     
						            //define select handler
						            change: function() {
						                         
						                //prevent 'to' field being updated and correct position
						                $("#to").val("").css("top", 2);
						            }
						        });                     
						    });

								//add click handler to friends div
								$("#friends").click(function(){
								                     
								    //focus 'to' field
								    $("#to").focus();
								});
								                 
								//add live handler for clicks on remove links
								$(".remove", document.getElementById("friends")).live("click", function(){
								                 
								    //remove current friend
								    $(this).parent().remove();
								                     
								    //correct 'to' field position
								    if($("#friends span").length === 0) {
								        $("#to").css("top", 0);
								    }               
								});
						</script> -->

		
			</div><!-- #content -->
			<?php get_sidebar(); ?>
			<div class="clear"></div>
			
		</div><!-- #primary -->

	</div>

	<?php
	//############################################
	//#############    FIREPHP  ##################
 	

	$firephp = FirePHP::getInstance(true);
	 
	$var = $mydb;
	$var_2 = $allUsers;
	$var_3 = $customTerms;
	$var_4 =$response;

	//$firephp->log($var_2,'$allUsers');
	//$firephp->log($var_3,'$customTerms');
	$firephp->log($var_4,'$response');



	
	
	//############################################
	//############################################ ?>
<?php get_footer(); ?>

</div>