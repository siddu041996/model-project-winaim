 $(document).ready(function() {
                $('select').material_select();
                $('.modal').modal({
                    dismissible: false
                });
            });
        
            
            // Initialize collapse button
            $('.button-collapse').sideNav({
                menuWidth: 300, // Default is 300
                edge: 'left', // Choose the horizontal origin
                closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                draggable: true // Choose whether you can drag to open on touch screens
            });
            
             // Initialize collapse button
            $('.btn-right-panel').sideNav({
                edge: 'right', // Choose the horizontal origin
                closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                draggable: false // Choose whether you can drag to open on touch screens
            });
			// <!-- datatable starts  -->
			$(document).ready( function () {
				$('#example').DataTable( {
					responsive: true
				} );
			});
			// <!-- Date range  -->
			$(function() {

				var start = moment().subtract(29, 'days');
				var end = moment();

				function cb(start, end) {
					$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
				}

				$('#reportrange').daterangepicker({
					startDate: start,
					endDate: end,
					ranges: {
					   'Today': [moment(), moment()],
					   'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
					   'Last 7 Days': [moment().subtract(6, 'days'), moment()],
					   'Last 30 Days': [moment().subtract(29, 'days'), moment()],
					   'This Month': [moment().startOf('month'), moment().endOf('month')],
					   'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
					}
				}, cb);

				cb(start, end);

			});
			<!-- Free text Search -->
			function searchS() {
				var inputID = "searchS";
				var parentID = "filter_1";
				filterLogic(inputID, parentID);				
			}
			function searchFT() {
				var inputID = "searchFT";
				var parentID = "filter_2";
				filterLogic(inputID, parentID);				
			}
			function searchF() {
				var inputID = "searchF";
				var parentID = "filter_3";
				filterLogic(inputID, parentID);				
			}
			function filterLogic(inputID, parentID){
				// Declare variables
				var input, filter, ul, li, a, i;

				input = document.getElementById(inputID);
				//input = document.getElementById('searchS');
				filter = input.value.toUpperCase();
				ul = document.getElementById(parentID);
				//ul = document.getElementById("filter_1");
				li = ul.getElementsByTagName('label');

				// Loop through all list items, and hide those who don't match the search query
				for (i = 0; i < li.length; i++) {
					a = li[i].getElementsByTagName("span")[0];
					if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
						li[i].style.display = "";
					} else {
						li[i].style.display = "none";
					}
				}
			}
			
			$('.apply_btn').click(function () {
				var applyID = $(this).attr("id");
				if(applyID == "f1") {
					var div_ID = "#filter_1";
				}
				else if(applyID == "f2") {				
					var div_ID = "#filter_2";
				}
				else if(applyID == "f3") {
					var div_ID = "#filter_3";				
				}
				else {
					var check = "";
				} 
				
				var check = $(div_ID).find('input[type=checkbox]:checked').length;
				//alert(check);
				var divClass = div_ID.replace('#', '.');
				if (check === 0) {
					$(divClass+".active .checkbox_count").html(" ");
				}
				else {
					$(divClass+".active .checkbox_count").html("- "+check);
				}
			   return false;
			});
			$('.select_all').click(function(event) {
			  var selectedAllId = $(this).attr("id");
			  
			  if(selectedAllId == "selectAllS") {
					var sdiv_ID = "#filter_1";
				}
				else if(selectedAllId == "selectAllFT") {				
					var sdiv_ID = "#filter_2";
				}
				else if(selectedAllId == "selectAllF") {
					var sdiv_ID = "#filter_3";				
				}
				else if(selectedAllId == "selectAllR") {
					var sdiv_ID = "#filter_5 .region_div";				
				}
				else if(selectedAllId == "selectAllJR") {
					var sdiv_ID = "#filter_5 .jr_div";				
				}
				else if(selectedAllId == "selectAllU") {
					var sdiv_ID = "#filter_5 .user_div";				
				}
				else {
					//var check = "";
				}
	
				
			 // alert(selectedAllId);
			  if(this.checked) {
				  // Iterate each checkbox
				  $(sdiv_ID+" :checkbox").each(function() {
					  this.checked = true;
				  });
			  }
			  else {
				$(sdiv_ID+" :checkbox").each(function() {
					  this.checked = false;
				  });
			  }
			});