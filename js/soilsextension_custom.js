$( document ).ready(function() {
alert(console.log("testing"));

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

headeroverlay_hght();

}); 