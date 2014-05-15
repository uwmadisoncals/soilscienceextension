$( document ).ready(function() {
//alert("testing");

/*if (typeof jQuery.ui !=='undefined'){
	alert("JQuery UI loaded");
}else{
	alert("No jquery UI");
}*/

// Fix the height of the main div based upon the number of rows in the Main navigation. Supports up to 3 rows.
var headeroverlay_hght = function (){
	var currnt_ho_hght = (parseInt($("div.headeroverlay").css("height")));
	if( currnt_ho_hght>40 && currnt_ho_hght <= 80){
		$("div#main").css("padding-top",40);
	}else if(currnt_ho_hght>80 && currnt_ho_hght <=120){
		$("div#main").css("padding-top",80);
	}else if(currnt_ho_hght>120 && currnt_ho_hght < 160){
		$("div#main").css("padding-top",120);
	};
};

/*var SoilsExtAutoComplete = function(){
	$('#wcmc-ajax').autocomplete({
		source:availableTags
	});

}; */

headeroverlay_hght();

 
						          
						        //attach autocomplete
						        $("#to").autocomplete({
						                     
						            //define callback to format results
						            source: function(req, add){
						                     
						                //pass request to server
						                $.getJSON("scripts1/wcmcAJAX2.php?callback=?", req, function(data) {  
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
							

}); 