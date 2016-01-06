$(function(){
	
	"use strict"


	$('form').on('submit',function(e){
		
		var err=0;
		$('div.error').removeClass('error alert alert-danger');

		//devstart
		var rDevStartDate = $.trim($('[name=rDevStartDate]').val());
		var eDevStartDate = $.trim($('[name=eDevStartDate]').val());
		
		if (rDevStartDate != "" && eDevStartDate == "") {
			$('[name=eDevStartDate]').parents('.form-group').addClass('error alert alert-danger');
			err++;
		}

		//dev finish
		var rDevFinishDate = $.trim($('[name=rDevFinishDate]').val());
		var eDevFinishDate = $.trim($('[name=eDevFinishDate]').val());
		
		if (rDevFinishDate != "" && eDevFinishDate == "") {
			$('[name=eDevFinishDate]').parents('.form-group').addClass('error alert alert-danger');
			err++;
		}

		//with development finish but dont have development start
		if (eDevFinishDate != "" && rDevStartDate == "") {
			$('[name=rDevStartDate]').parents('.form-group').addClass('error alert alert-danger');
			err++;
		}

		//jurisdiction date
		var abbrlength = $('.t_abbr').length;

		for (var x=0; x < abbrlength; x++  ) {

			//est submission
			var eSubmissionDate = $('.eSubmissionDate_'+x+' input');
			var es_v = $.trim(eSubmissionDate.val());
			
			//result submission
			var rSubmissionDate = $('.rSubmissionDate_'+x+' input');
			var rs_v = $.trim(rSubmissionDate.val());
			
			//with submission but dont have development
			if (es_v != "" && rDevFinishDate == "") {
				$('[name=rDevFinishDate]').parents('.form-group').addClass('error alert alert-danger');
				err++;
			}

			if (rs_v != "" && es_v == "") {
				eSubmissionDate.parents('.form-group').addClass('error alert alert-danger');
				err++;
			}

			//Approval (Estimated)
			var eApprovalDate = $('.eApprovalDate_'+x+' input');
			var ea_v = $.trim(eApprovalDate.val());
			
			//Approval (Result)
			var rApprovalDate = $('.rApprovalDate_'+x+' input');
			var ra_v = $.trim(rApprovalDate.val());

			if (ra_v != "" && ea_v == "") {
				eApprovalDate.parents('.form-group').addClass('error alert alert-danger');
				err++;
			}

			//has approval but dont have submission
			if (ea_v != "" && rs_v == "") {
				rSubmissionDate.parents('.form-group').addClass('error alert alert-danger');
				err++;
			}

			//Master Release (Estimated)
			var eReleaseDate = $('.eReleaseDate_'+x+' input');
			var er_v = $.trim(eReleaseDate.val());
			
			//Master Release (Result)
			var rReleaseDate = $('.rReleaseDate_'+x+' input');
			var rr_v = $.trim(rReleaseDate.val());

			if (rr_v != "" && er_v == "") {
				eReleaseDate.parents('.form-group').addClass('error alert alert-danger');
				err++;
			}

			//has master release but dont have approval
			if (er_v != "" && ra_v == "") {
				rApprovalDate.parents('.form-group').addClass('error alert alert-danger');
				err++;
			}

			//Launch (Estimated)
			var eLaunchDate = $('.eLaunchDate_'+x+' input');
			var el_v = $.trim(eLaunchDate.val());
			
			//Launch (Result)
			var rLaunchDate = $('.rLaunchDate_'+x+' input');
			var rl_v = $.trim(rLaunchDate.val());

			if (rl_v != "" && el_v == "") {
				eLaunchDate.parents('.form-group').addClass('error alert alert-danger');
				err++;
			}

			//has launch but dont have master release
			if (el_v != "" && rr_v == "") {
				rReleaseDate.parents('.form-group').addClass('error alert alert-danger');
				err++;
			}


			//Regulator (Estimated)
			var eRegulatorDate = $('.eRegulatorDate_'+x+' input');
			var ereg_v = $.trim(eRegulatorDate.val());
			
			//Regulator (Result)
			var rRegulatorDate = $('.rRegulatorDate_'+x+' input');
			var rreg_v = $.trim(rRegulatorDate.val());

			if (rreg_v != "" && ereg_v == "") {
				eRegulatorDate.parents('.form-group').addClass('error alert alert-danger');
				err++;
			}

			//has regulator but dont have launch
			if (ereg_v != "" && rl_v == "") {
				rLaunchDate.parents('.form-group').addClass('error alert alert-danger');
				err++;
			}

		}	

		//Artwork (SP) Upload (Estimated)
		var eArtwork = $.trim($('#artwork-est').val());
		var rArtwork = $.trim($('#artwork-rest').val());
	
		if (rArtwork != "" && eArtwork == "") {
			$('#artwork-est').parents('.form-group').addClass('error alert alert-danger');
			err++;
		}

		//G-Slick Upload (Estimated)
		var egslick = $.trim($('#gslick-est').val());
		var rgslick = $.trim($('#gslick-rest').val());
	
		if (rgslick != "" && egslick == "") {
			$('#gslick-est').parents('.form-group').addClass('error alert alert-danger');
			err++;
		}

		//Demo Software
		var esoftware = $.trim($('#demo-software-release-est').val());
		var rsoftware = $.trim($('#demo-software-release-rest').val());
	
		if (rsoftware != "" && esoftware == "") {
			$('#demo-software-release-est').parents('.form-group').addClass('error alert alert-danger');
			err++;
		}

		//Movie (Estimated)
		var emovie = $.trim($('#movie-est').val());
		var rmovie = $.trim($('#movie-rest').val());
	
		if (rmovie != "" && emovie == "") {
			$('#movie-est').parents('.form-group').addClass('error alert alert-danger');
			err++;
		}


		//Artwork (TR)
		var etr = $.trim($('#artwork-tr-est').val());
		var rtr = $.trim($('#artwork-tr-rest').val());
	
		if (rtr != "" && etr == "") {
			$('#artwork-tr-est').parents('.form-group').addClass('error alert alert-danger');
			err++;
		}

		//Website (Estimated)
		var eweb = $.trim($('#website-est').val());
		var rweb = $.trim($('#website-rest').val());
	
		if (rweb != "" && eweb == "") {
			$('#website-est').parents('.form-group').addClass('error alert alert-danger');
			err++;
		}


		if (err > 0) {
			return false;
		}

	});

});