$(function(){
	
	"use strict"

	$('[name=approvedbtn]').on('click',function(e){
		e.preventDefault();
		var _me = $(this);
		var href = $(this).attr('href');
		

		$.get( href, {} )
		  	.done(function( data ) {
		  		if (data.error > 0) {
		  			Notifier.error(data.mess);
		  		} else {
		  			_me.parents('.wrap-pub').slideUp('slow');
		  			Notifier.success('Successfully Aproved');

		  		}
			})
		  	
		  	.fail(function() {
		  		Notifier.error('Something may be wrong..');
			});

	});



});

(function(){

	Version = function() {

		var addcss = function(wname,tname) {

			$('.'+tname).css({
				'color': 'red',
			});

			$('.'+wname).css({
				'color': 'green',
			});
		}

		var processAbbr = function(tbbr,wabbr) {

			var t_abbr = tbbr.length;
			var t_abbr_arr = {};

			for (var x=0; x < t_abbr; x++  ) {


				if ( $.trim($('.w_sub_est'+x).text()) !=  $.trim($('.t_sub_est'+x).text()) ) {
					addcss('w_sub_est'+x,'t_sub_est'+x);
				}

				if ( $.trim($('.w_apprv_est'+x).text()) !=  $.trim($('.t_apprv_est'+x).text()) ) {
					addcss('w_apprv_est'+x,'t_apprv_est'+x);
				}

				if ( $.trim($('.w_release_est'+x).text()) !=  $.trim($('.t_release_est'+x).text()) ) {
					addcss('w_release_est'+x,'t_release_est'+x);
				}

				if ( $.trim($('.w_launch_est'+x).text()) !=  $.trim($('.t_launch_est'+x).text()) ) {
					addcss('w_launch_est'+x,'t_launch_est'+x);
				}

				if ( $.trim($('.w_sub_fn'+x).text()) !=  $.trim($('.t_sub_fn'+x).text()) ) {
					addcss('w_sub_fn'+x,'t_sub_fn'+x);
				}

				if ( $.trim($('.w_apprv_fn'+x).text()) !=  $.trim($('.t_apprv_fn'+x).text()) ) {
					addcss('w_apprv_fn'+x,'t_apprv_fn'+x);
				}

				if ( $.trim($('.w_release_fn'+x).text()) !=  $.trim($('.t_release_fn'+x).text()) ) {
					addcss('w_release_fn'+x,'t_release_fn'+x);
				}

				if ( $.trim($('.w_launch_fn'+x).text()) !=  $.trim($('.t_launch_fn'+x).text()) ) {
					addcss('w_launch_fn'+x,'t_launch_fn0'+x);
				}

			}

		}

		return {

			diff: function(params)
			{
				if (params['t_gvn'] != params['w_gvn']) {
					addcss('w_gvn','t_gvn');
				}

				if (params['w_title'] != params['t_title']) {
					addcss('w_title','t_title');
				}

				if (params['w_controlno'] != params['t_controlno']) {
					addcss('w_controlno','t_controlno');
				}

				if (params['w_branch'] != params['t_branch']) {
					addcss('w_branch','t_branch');
				}

				if (params['w_category'] != params['t_category']) {
					addcss('w_category','t_category');
				}

				if (params['w_type'] != params['t_type']) {
					addcss('w_type','t_type');
				}

				if (params['w_overview'] != params['t_overview']) {
					addcss('w_overview','t_overview');
				}

				if (params['w_dev_st'] != params['t_dev_st']) {
					addcss('w_dev_st','t_dev_st');
				}

				if (params['w_dev_fn'] != params['t_dev_fn']) {
					addcss('w_dev_fn','t_dev_fn');
				}

				if (params['w_platform'] != params['t_platform']) {
					addcss('w_platform','t_platform');
				}

				if (params['w_market'] != params['t_market']) {
					addcss('w_market','t_market');
				}

				if (params['w_group'] != params['t_group']) {
					addcss('w_group','t_group');
				}

				if (params['w_target'] != params['t_target']) {
					addcss('w_target','t_target');
				}

				if (params['w_character'] != params['t_character']) {
					addcss('w_character','t_character');
				}

				if (params['w_r_dev_st'] != params['t_r_dev_st']) {
					addcss('w_r_dev_st','t_r_dev_st');
				}

				if (params['w_r_dev_fn'] != params['t_r_dev_fn']) {
					addcss('w_r_dev_fn','t_r_dev_fn');
				}

				if (params['t_abbr'] || params['w_abbr']) {
					processAbbr(params['t_abbr'],params['w_abbr']);
				}

			}

		}


	}

})()