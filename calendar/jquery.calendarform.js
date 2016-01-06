/**
 * jQuery user chooser.
 * 
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.autocomplete.js
 *
 */
$.widget("ui.calendarform", {
	
	_create: function() {
		var me = this;
		me.options.onShowForm = (me.options.onShowForm) ? me.options.onShowForm : function() {};
		this.form = null;
		this.container = $('<div style="display:none;" />');
		$(this.element).html(this.container);
		
		$.post(this.options.form_url, '', function(data) {
			me.options.onShowForm();
			me.container.html(data);
			me.form = me.container.children('form');
			
			me.form.find('#calendar_form_save_button').click(function() {				
				var loader = $('<img src="/images/loading_small.gif">');
				me.form.find('#calendar_form_save_button')
					.css('display', 'none')
					.after(loader);
				
				$.post(me.form.attr('action'), me.form.serialize(), function(data) {
					var d = eval('(' + data + ')');
					
					if(d.is_successful) {
						me.cleanUp(function() {
							me.options.onSave(data);
							loader.remove();
							me.form.find('#calendar_form_save_button').css('display', '');
						});
					}
					else {
						for(i in d.errors) {
							if(0 < $.trim(d.errors[i]).length) {
								$('#' + i + '_errors').remove();
								$('#' + i).after($('<div id="'+i+'_errors" style="display:none;" />').html(d.errors[i]).slideDown().delay(1500).slideUp());
							}
						}
						
						loader.remove();
						me.form.find('#calendar_form_save_button').css('display', '');
					}
				});
				
				return false;
			});
			
			me.form.find('#calendar_form_cancel_button').click(function() {
				me.cleanUp(me.options.onCancel);
				
				return false;
			});

			me.form.find('#calendar_form_delete_button').click(function() {
				$('<div title="Delete" />')
					.html('<p>Are you sure you want to delete this calendar?</p>')
					.dialog({
						closeText: 'Cancel',
						modal: true,
						buttons: {
							Cancel: function() {
								$(this).dialog("close");								
							},
							Delete: function() {
								$(this).dialog("close");
								$.post(me.form.attr('delete_action'), '', function(data) {
									me.cleanUp(function() {
										me.options.onDelete(data);
									});
								});
							}
						}
					});
				
				return false;
			});
			
			me.container.slideDown('fast');			
		});
	},
	
	cleanUp: function(f) {
		var me = this;
		this.container.slideUp('fast', function() {
			if(f) {
				f();
			}
			
			$(me.element).calendarform("destroy");
		});
	},
	
	triggerOnCancel: function() {
		this.options.onCancel();
	}
});