var MailboxManager = (function($){
	return {

		page				  : 1,
		mailId				  : 0,
		mailAction			  : '',
		mailboxId			  : 0,
		totalMails			  : 0,
		mailboxName			  : '',
		rowsLimit			  : 20,
		customizedMailboxId   : 0,
		customizedMailboxName : '',
		searchKeyword		  : '',
		canBeDeleted          : 0,

		// the ajax handler for retrieving message
		loadMessagesUrl		  : '',

		// setters
		setPage: function(page){
			this.page = page;
		},
		setAction: function(action){
			this.mailAction = action;
		},
		setEmailId: function(id){
			this.mailId = id;
		},
		setMailboxId: function(id){
			this.mailboxId = id;
		},
		setRowsLimit: function(rows){
			this.rowsLimit = rows;
		},
		setMailboxName: function(name){
			this.mailboxName = name;
		},
		setTotalMailboxMails: function(total){
			this.totalMails = total;
		},
		setCustomizedMailboxId: function(id){
			this.customizedMailboxId = id;
		},
		setCustomizedMailboxName: function(name){
			this.customizedMailboxName = name;
		},
		setCanBeDeleted: function(canBeDeleted){
			this.canBeDeleted = canBeDeleted;
		},

		// getters
		getPage: function(){
			return this.page;
		},
		getAction: function(){
			return this.mailAction;
		},
		getEmailId: function(){
			return this.mailId;
		},
		getMailboxId: function(){
			return this.mailboxId;
		},
		getRowsLimit: function(){
			return this.rowsLimit;
		},
		getMailboxName: function(){
			return this.mailboxName;
		},
		getTotalMailboxMails: function(){
			return this.totalMails;
		},
		getCustomizedMailboxId: function(){
			return this.customizedMailboxId;
		},
		getCustomizedMailboxName: function(){
			return this.customizedMailboxName;
		},
		getCanBeDeleted: function(){
			return this.canBeDeleted;
		},

		showRelatedMails: function(id, url){
			url = url || '/mailbox/showRelatedMails';
			var showLink = $('#toggle_show_'+id);
			var hideLink = $('#toggle_hide_'+id);

			showLink.hide();
			hideLink.show();

			// display loading indicator
			$('#loading_hdn_mails_'+id).show();

			$.getJSON(url + '?id='+id+'&mailbox_id='+MailboxManager.getMailboxId()+'&page='+MailboxManager.getPage(), function(json) {
				$('#loading_hdn_mails_'+id).hide();
				$('#hdn_mails_'+id).show();
				$('#hdn_mails_'+id).empty().html(json.html);

				var status = $('#select_all').attr('checked');

				if( status ){
					$('input[name=emails]').each(function() {
						this.checked = status;
					});
				}
			});

			document.getElementById('hdn_mails_'+id).style.display = '';
		},
		hideRelatedMails: function(id){
			var showLink = $('#toggle_show_'+id);
			var hideLink = $('#toggle_hide_'+id);

			showLink.show();
			hideLink.hide();

			document.getElementById('hdn_mails_'+id).style.display = 'none';
		},
		showHideMailContent: function(id){
			$('#foldersList').hide();
			var arrId = id.split('_');
			emailId = arrId[1];

			if( !$('#content_' + emailId).is(':visible') ){
				if( !$('#summary_' + emailId).hasClass('threadChild') ){
					$('.hdn_mails').hide();
					$('.toggle_hide').hide();
					$('.toggle_show').show();
				}

				if( $('#hdn_mails_' + emailId).length > 0 ){
					MailboxManager.showRelatedMails(emailId);
				}

				$('.content').hide();
				$('#content_' + emailId).show();
			}
			else{
				$('.content').hide();

				if( !$('#summary_' + emailId).hasClass('threadChild') ){
					$('.hdn_mails').hide();
					$('.toggle_hide').hide();
					$('.toggle_show').show();
				}
			}

			var array = location.href.split('#');
			document.location = array[0] + '#summary_' + emailId;
		},
		showHideOtherRecipients: function(id, count){
			// show other recipients
			if ( 'none' == $('#content_other_recipients_'+id).css('display') ){
				// hide all opened other mail recipients
				$('.content_other_recipients').slideUp('slow');

				// change text of the link of hidden other recipients
				var elements = $('a.other_recipients');
				elements.each(function() {
					var arrId = this.id.split('_');
					$(this).html('show '+arrId[1]+' more');
				});

				// change text of link
				$('#other_'+count+'_recipients_'+id).html('hide');

				// show content
				$('#content_other_recipients_'+id).slideDown('slow');
			}
			// hide other recipients
			else{
				// hide content
				$('#content_other_recipients_'+id).slideUp('slow');

				// change text of link
				$('#other_'+count+'_recipients_'+id).html('show '+count+' more');
			}
		},
		openMail: function(id, url){
			url = url || '/mailbox/setAsReadOrUnreadEmails';
			var emailId = id.split('_');

			if( $('#' + id).hasClass('strong') ){
				$.post(
					url,
					{ ids : emailId[1], flag : 1, modifyTitleOnly : 1, mailboxId : MailboxManager.getMailboxId() },
					function(json){},
					'json'
				);
				
				$('#summary_' + emailId[1] + ' td:nth-child(3)').empty().html('&nbsp;');
				$('#' + id).removeClass('strong subject').addClass('subject');
			}

			$('#actions_' + emailId[1]).show();
		},
//NOTE: where is this used?
//		forwardMail: function(id, rootId, url){
//			url = url || '/mailbox/displayForwardForm';
//			$('#mailsDiv').hide();
//			$('#create_message_loading_indicator').show();
//
//			MailboxManager.setEmailId(id);
//
//			$.getJSON(url + '?id=' + id + '&mailboxId=' + MailboxManager.getMailboxId() + '&mailboxName=' + MailboxManager.getMailboxName() + '&page=' + MailboxManager.getPage() + '&rootId=' + rootId, function(json){
//				$('#create_message_loading_indicator').hide();
//				$('#mailsDiv').empty().html(json.html).show();
//
//				if( json.cntAttachments > 0 )
//					$('#uploadAttachments').show();
//			});
//		},
		flagUnflagEmail: function(id, isFlagged){
			$('#hidSelectedEmailsId').attr('value', id);

			if( isFlagged )
				$('#unflag_dialog').dialog('open');
			else
				$('#flag_dialog').dialog('open');
		},
		setAsReadOrUnreadEmails: function(flag, url){
			url = url || '/mailbox/setAsReadOrUnreadEmails';
			var str = 'read';
			if( 0 == flag )
				str = 'un' + str;

			$('#' + str + '_message').hide();
			$('#' + str + '_loading_image').show();
			$('.ui-dialog-buttonpane button:last').attr('disabled', true);

			$.post(
				url,
				{ ids : encodeURIComponent($('#hidSelectedEmailsId').val()), mailboxId : MailboxManager.getMailboxId(), flag : flag, page: MailboxManager.getPage() },
				function(json) {
					$('#' + str + '_loading_image').hide();

					if( json.error > 0 )
						$('#' + str + '_error').empty().html('Not all selected items were set as ' + str + ' emails due to an error encountered by the system.').show();
					else{
						$('#mailsDiv').empty().html(json.html);
						$('#' + str + '_dialog').dialog('close');
					}
				},
				'json'
			);
		},
		getMailboxMessages: function(mailbox_id, mailbox_name, canBeDeleted, url){
			url = url || '/mailbox/displayMailboxMails';
			mailbox_name = this.formatString(mailbox_name);

			this.setMailboxId(mailbox_id);
			this.setMailboxName(mailbox_name);
			this.setCanBeDeleted(canBeDeleted);

			$('#foldersList').hide();
			$('#list').hide();
			$('#loading').show();
			$("#search_form_keyword").val("Search");

			$.getJSON(url + '?id=' + mailbox_id, function(json) {
				$('#loading').hide();
				$('#list').show();
				$('#mailsDiv').empty().html(json.html);
			});
		},
		getCustomizedMailboxMessages: function(mailbox_id, mailbox_name, canBeDeleted, url) {
			url = url || '/mailbox/displayMailboxMails';
			mailbox_name = this.formatString(mailbox_name);

			this.setMailboxId(mailbox_id);
			this.setMailboxName(mailbox_name);
			this.setCanBeDeleted(canBeDeleted);

			this.setCustomizedMailboxId(0);
			this.setCustomizedMailboxName('');

			$('#list').hide();
			$('#loading').show();
			$('#foldersList').hide();
			$("#search_form_keyword").val("Search");

			$.getJSON(url + '?id=' + mailbox_id, function(json) {
				$('#loading').hide();
				$('#list').show();
				$('#mailsDiv').empty().html(json.html);
				$('#selectedCustomizedFolder').empty().html(mailbox_name).show();
				$('#selectFolders').removeClass().addClass('strong clearfix selected');
			});
		},
		backToMessages: function(mailbox_id, mailbox_name, page, rootId) {
			this.setMailboxId(mailbox_id);
			this.setMailboxName(this.formatString(mailbox_name));
			this.setPage(page);

			$('#mailsDiv').empty().hide();
			$('#create_message_loading_indicator').show();

			$.getJSON('/mailbox/displayMailboxMails?id=' + mailbox_id + '&page=' + page, function(json) {
				$('#create_message_loading_indicator').hide();
				$('#mailsDiv').html(json.html).show();

				if( window.location.hash ){
					var array = window.location.hash.split('_');
					var emailId = array[1];

					if( emailId != rootId ){
						$('#toggle_show_' + rootId).hide();
						$('#toggle_hide_' + rootId).show();

						$('#hdn_mails_' + rootId).show();
						$('#loading_hdn_mails_' + rootId).show();

						$.getJSON('/mailbox/showRelatedMails?id=' + rootId + '&mailbox_id=' + MailboxManager.getMailboxId() + '&page='+MailboxManager.getPage(), function(json) {
							$('#hdn_mails_'+rootId).empty().html(json.html);
							$('#loading_hdn_mails_' + rootId).hide();
							MailboxManager.showHideMailContent('subject_' + emailId);
						});
					}
					else{
						MailboxManager.showHideMailContent('subject_' + emailId);
					}
				}
			});
		},
		getMoreMailboxMessages: function(mailbox_id, mailbox_name, page, url){
			url = url || '/mailbox/displayMoreMailboxMails';
			$('input[id=select_all]').attr('checked', false);
			$('#foldersList').hide();

			// set current page
			MailboxManager.setPage(page);

			// get list of all email Ids
			var lstIds = $('#hidAllEmailsId').val();

			// remove view more emails link
			$('#view_more_emails').remove();
			// remove hidden field that holds list of email ids
			$('#hidAllEmailsId').remove();
			// remove hidden field that holds list of selected email ids
			$('#hidSelectedEmailsId').remove();
			// hide class container of view more emails link
			$('.moreLink').hide();
			// show loading indicator
			$('#more_emails_loading_indicator').show();

			$.getJSON(url + '?id=' + mailbox_id +'&keyword='+this.searchKeyword+ '&page=' + page + '&ids=' + lstIds, function(json) {
				// hide loading indicator
				$('#more_emails_loading_indicator').hide();

				// show view more emails link
				if ( (page*MailboxManager.getRowsLimit())< MailboxManager.getTotalMailboxMails() ){
					var aLink = $('<a />')
					.attr('id', 'view_more_emails')
					.attr('href', 'javascript:void(0)')
					.attr('onclick', "MailboxManager.getMoreMailboxMessages("+mailbox_id+", '"+mailbox_name+"', "+(page+1)+", '"+url+"')" )
					.html('View More Emails');
					$('.moreLink').append(aLink).show();
				}
				// append other emails in the mailbox email container
				$('#mailbox_email_container').append(json.html);
			});
		},
		validate: function(){
			var recipient = $('#email_recipient_email_address').val();
			if ( 0 < recipient.length){
				//$('#error_recipient').hide();
				$('#error_recipient').css({'display':'none'});
				return true;
			}
			else{
				//$('#error_recipient').show();
				$('#error_recipient').css({'display':'block'});
				return false;
			}
		},
		proceedSendEmail: function(url){
			url = url || '/mailbox/sendEmail';
			var subject		= $('#email_subject').val();
			var content		= $('#email_content').val();
			var cc_emails	= $('#email_cc_email_address').val();
			var bcc_emails	= $('#email_bcc_email_address').val();
			var to_emails	= $('#email_recipient_email_address').val();
			var attachedFiles = $('#hidFiles').val();
			var filesToBeAddedToFileVault = $('#hidAddToFileVaultIds').val();
			
			var params = 'to_emails='+to_emails+'&cc_emails='+cc_emails+'&bcc_emails='+bcc_emails+'&subject='+subject+'&content='+encodeURIComponent(content);
			params += '&attachedFiles=' + encodeURIComponent(attachedFiles);
			params += '&filesToBeAddedToFileVault=' + encodeURIComponent(filesToBeAddedToFileVault);
			params += '&hasForwardedFile=' + $('#hidHasForwardedFile').val();
			params += '&forwardedFileID=' + $('#hidForwardedFileID').val();
			
			$.getJSON(url+'?'+params+'&page='+MailboxManager.getPage()+'&mailbox_id='+MailboxManager.getMailboxId()+'&mailbox_name='+MailboxManager.getMailboxName(), function(json){
				$('#send_email').dialog('open');
				$(".sendMail").show();
				$('#send_message_loading_indicator').hide();

				if( 0 == json.success ){
					$('#email_sending_error').show();
					$('#email_sending_success').hide();
				}
				else{
					$('#email_sending_error').hide();
					$('#email_sending_success').show();
				}
			});
		},
		moveEmails: function(url) {
			url = url || '/mailbox/moveEmails';

			$('#cmbMailboxes').attr('disabled', true);
			$('#move_loading_image').show();

			$.post(
				url,
				{ ids : encodeURIComponent($('#hidSelectedEmailsId').val()), old_mailbox_id : MailboxManager.getMailboxId(), new_mailbox_id : $('#cmbMailboxes').val() },
				function(json) {
					MailboxManager.setMailboxId($('#cmbMailboxes').val());
					$('#move_loading_image').hide();
					$('#mailsDiv').empty().html(json.html);
					$('#move_dialog').dialog('close');
				},
				'json'
			);
		},
		deleteMail: function(url){
			url = url || '/mailbox/deleteEmail';
			// show loading emails indicator
			$('#loading').show();
			// hide emails
			$('#list').hide();

			$.post(
				url,
				{ id : MailboxManager.getEmailId(), mailbox_id : MailboxManager.getMailboxId(), page : MailboxManager.getPage() },
				function(json){
					$('#loading').hide();
					$('#list').show();
					$('#mailsDiv').empty().html(json.html);
				},
				'json'
			);
		},
		batchDeleteMails: function(url){
			url = url || '/mailbox/batchDeleteEmails';
			// show loading emails indicator
			$('#loading').show();
			// hide emails
			$('#list').hide();

			$.post(
				url,
				{ ids : encodeURI($('#hidSelectedEmailsId').val()), mailbox_id : MailboxManager.getMailboxId(), page : MailboxManager.getPage() },
				function(json) {
					$('#loading').hide();
					$('#list').show();
					$('#mailsDiv').empty().html(json.html);
				},
				'json'
			);
		},
		replyEmail : function(id, rootId, url) {
			url = url || '/mailbox/displayReplyForm';
			$('#mailsDiv').hide();
			$('#create_message_loading_indicator').show();

			MailboxManager.setEmailId(id);

			$.getJSON(url + '?id=' + id + '&mailboxId=' + MailboxManager.getMailboxId() + '&mailboxName=' + MailboxManager.getMailboxName() + '&page=' + MailboxManager.getPage() + '&rootId=' + rootId, function(json){
				$('#create_message_loading_indicator').hide();
				$('#mailsDiv').empty().html(json.html).show();
			});
		},
		cancelReply: function(id) {
			$('#reply_' + id).hide();
			$('#actions_' + id).show();
			$('#wrapped_content_' + id).show();
			$('#content_' + id).show();

			var array = location.href.split('#');
			document.location = array[0] + '#summary_' + id;
		},
		cancelForward: function(id){
			$('#uploadAttachments').hide();
			$('#forward_' + id).hide();
			$('#actions_' + id).show();
			$('#content_' + id).show();
		},
		executeFlagUnflagEmail: function(flag, url){
			url = url || '/mailbox/flagUnflagEmails';
			var str = 'flag';
			if( 0 == flag )
				str = 'un' + str;

			$('#' + str + '_message').hide();
			$('#' + str + '_loading_image').show();
			$('.ui-dialog-buttonpane button:last').attr('disabled', true);

			$.post(
				url,
				{ id : $('#hidSelectedEmailsId').val(), mailboxId : MailboxManager.getMailboxId(), page: MailboxManager.getPage() },
				function(json) {
					$('#' + str + '_loading_image').hide();

					if( json.error > 0 )
						$('#' + str + '_error').empty().html('An error encountered by the system while ' + str + 'ging the selected email.').show();
					else{
						$('#mailsDiv').empty().html(json.html);
						$('#' + str + '_dialog').dialog('close');
					}
				},
				'json'
			);
		},
		executeDeleteEmail: function(id, page, mailbox_id) {
			MailboxManager.setPage(page);
			MailboxManager.setEmailId(id);
			MailboxManager.setMailboxId(mailbox_id);
			$('#delete_email_dialog').dialog('open');
		},
		emptyTrash: function(){
			$('#empty_trash_dialog').dialog('open');
		},
		executeEmptyTrash: function(url) {
			url = url || '/mailbox/emptyTrash';
			$('#loading').show();
			$('#list').hide();

			$.post(
				url,
				{ mailbox_id : MailboxManager.getMailboxId() },
				function(json) {
					$('#loading').hide();
					$('#list').show();
					$('#mailsDiv').empty().html(json.html);
				},
				'json'
			);
		},
		renameMailbox: function(mailbox_id, mailbox_name) {
			mailbox_name = this.formatString(mailbox_name);

			this.setCustomizedMailboxId(mailbox_id);
			this.setCustomizedMailboxName(mailbox_name);

			$('#txtRenameFolderName').attr('value', mailbox_name);
			$('#rename_folder_dialog_form').dialog('open');
		},
		deleteMailbox: function(mailbox_id, mailbox_name) {
			mailbox_name = this.formatString(mailbox_name);

			this.setCustomizedMailboxId(mailbox_id);
			this.setCustomizedMailboxName(mailbox_name);

			$('#delete_folder_dialog').dialog('open');
		},
		formatString: function(str) {
			var regExp1 = new RegExp('&#039;','gim');
			var regExp2 = new RegExp('&quot;', 'gim');
			return str.replace(regExp1,'\'').replace(regExp2,'"');
		},
		displayCustomizedFolders: function() {
			if( $('#foldersList').is(':hidden') ){
				$('#' + this.getMailboxName()).removeClass().addClass('tabs_li');
				$('#selectFolders').removeClass().addClass('strong clearfix selected');
				$('#foldersList').mouseenter();
			}
			else{
				if( this.getCanBeDeleted() < 1 ){
					$('#selectFolders').removeClass().addClass('strong clearfix');
					$('#' + this.getMailboxName()).removeClass().addClass('tabs_li strong selected');
				}
			}

			$('#foldersList').toggle('fast');
		},
		doSearchMail: function(keyword)
		{
				this.searchKeyword = keyword;
				$('#foldersList').hide();
				$('#list').hide();
				$('#loading').show();

				$.getJSON(this.loadMessagesUrl+'?id=' + this.mailboxId+'&keyword='+keyword, function(json) {
					$('#loading').hide();
					$('#list').show();
					$('#mailsDiv').empty().html(json.html);
				});
		},
		clickCheckbox: function(id)
		{
			$('#foldersList').hide();
			var ids = $('#hidSelectedEmailsId').val();
			var str = id + '_';

			if( $('#chk_' + id).is(':checked') ){
				if( ids.indexOf(id) < 0 )
					$('#hidSelectedEmailsId').attr('value', ids + str);
			}
			else{
				var new_ids = '';

				for( var i=0; i<ids.length; i++ ){
					if( i < ids.indexOf(str) )
						new_ids += ids.charAt(i);
					if( i > (ids.indexOf(str) + (str.length-1)) )
						new_ids += ids.charAt(i);
				}

				$('#hidSelectedEmailsId').attr('value', new_ids);
				$('input[id=select_all]').attr('checked', false);
			}
		}
	}
})(jQuery);

(function($){
	$(document).ready(function() {
		$("#dialog").dialog("destroy");

		$('#create_folder_dialog_form').dialog({
			autoOpen : false,
			width : 400,
			modal : true,
			buttons : {
				Cancel : function() {
					$(this).dialog('close');
				},
				'Create folder' : function() {
					var folder_name = $('#txtFolderName').val();

					$('#error').hide();
					$('#loadingImage').show();
					$('.ui-dialog-buttonpane button:last').attr('disabled', true);

					if( (0 == folder_name.length) || (folder_name.length > 100) ){
						if( 0 == folder_name.length )
							$('#error').empty().html('Mailbox name is required.').show();
						else if( folder_name.length > 100 )
							$('#error').empty().html('Too long. A maximum of 100 characters only.').show();

						$('#loadingImage').hide();
						$('.ui-dialog-buttonpane button:last').attr('disabled', false);
					}
					else{

						$.post(
							'/mailbox/createMailbox',
							{ name: folder_name },
							function(json){
								$('#loadingImage').hide();

								if( json.error > 0 ){
									$('#error').empty().html('An error occurred while creating the folder \'' + folder_name +'\'').show();
									$('.ui-dialog-buttonpane button:last').attr('disabled', false);
								}
								else{
									MailboxManager.setMailboxId(json.mailbox_id);
									MailboxManager.setMailboxName(json.mailbox_name);
									MailboxManager.setCanBeDeleted(1);

									MailboxManager.setCustomizedMailboxId(0);
									MailboxManager.setCustomizedMailboxName('');

									$('#mailsDiv').empty().html(json.html);
									$('#selectFolders').removeClass().addClass('strong clearfix setBlock selected');
									$('#selectedCustomizedFolder').empty().html(json.mailbox_name).show();
									$('#create_folder_dialog_form').dialog('close');
								}
							},
							'json'
						);
					}
				}
			},
			close : function() {
				$('#txtFolderName').attr('value', '');
				$('#error').empty().hide();
				$('.ui-dialog-buttonpane button:last').attr('disabled', false);
			}
		});

		$('#delete_email_dialog').dialog({
			autoOpen : false,
			width : 400,
			modal : true,
			buttons : {
				Cancel : function() {
					$(this).dialog('close');
				},
				'Proceed Delete' : function() {
					MailboxManager.deleteMail();
					$(this).dialog('close');
				}
			}
		});

		$('#batch_delete_email_dialog').dialog({
			autoOpen : false,
			width : 400,
			modal : true,
			buttons : {
				Cancel : function() {
					$(this).dialog('close');
				},
				'Proceed Delete' : function() {
					MailboxManager.batchDeleteMails();
					$(this).dialog('close');
				}
			}
		});

		$('#send_email').dialog({
			autoOpen: false,
			width   : 400,
			modal   : true,
			buttons : {
				Ok : function(){
					$(this).dialog('close');
					window.location = '/mailbox';
					return;
				}
			}
		});

		$('#empty_trash_dialog').dialog({
			autoOpen : false,
			width : 400,
			modal : true,
			buttons : {
				Cancel : function() {
					$(this).dialog('close');
				},
				'Proceed Delete' : function() {
					$(this).dialog('close');
					MailboxManager.executeEmptyTrash();
				}
			}
		});

		$('#addMailbox').click(function() {
			$('#foldersList').hide();
			$('#create_folder_dialog_form').dialog('open');
		});

		$('#add_attachment').click(function() {
			$('#uploadAttachments').show();
		});

		$('#changePassword').click(function() {
			$('#user_password').show();
			$('#cancelPassword').show();
			$('#hidVisibility').attr('value', 'block');
			$(this).hide();
		});

		$('#cancelPassword').click(function() {
			$('#user_password').attr('value', '').hide();
			$('#changePassword').show();
			$('#hidVisibility').attr('value', 'none');
			$(this).hide();
		});

		$('#user_incoming_server_name').keyup(function(){
			if ($(this).val().indexOf('.gmail.com') > -1 )
				$('#user_security_connection').attr('value', '2');
			else
				$('#user_security_connection').attr('value', '0');
		});

//NOTE: where is this used?
//		$('#new_mail').click(function(){
//			$('#mailsDiv').hide();
//			$('#create_message_loading_indicator').show();
//
//			$.getJSON('/mailbox/displayNewMailForm?mailbox_id=' + MailboxManager.getMailboxId(), function(json){
//				$('#create_message_loading_indicator').hide();
//				$('#mailsDiv').empty().html(json.html).show();
//			});
//		});

		$('#foldersList').live('mouseover mouseout', function(event) {
		 	if (event.type == 'mouseover') {
		    	$(this).show();

		    	$('#' + MailboxManager.getMailboxName()).removeClass().addClass('tabs_li');
				$('#selectFolders').removeClass().addClass('strong clearfix selected');
		  	}
		  	else {
		    	$(this).hide();

		    	if( MailboxManager.getCanBeDeleted() < 1 ){
					$('#selectFolders').removeClass().addClass('strong clearfix');
					$('#' + MailboxManager.getMailboxName()).removeClass().addClass('tabs_li strong selected');
				}
		  	}
		});

		$('#user_password').attr('value', '');
	});
})(jQuery);