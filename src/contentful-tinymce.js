window.contentfulExtension.init(function(api) {
	function tinymceForContentful(api) {
		api.window.startAutoResizer();
		tinymce.init({
			selector: '#tiny',
			init_instance_callback : function(editor) {
				var listening = true;
				function getEditorContent() {
					return editor.getContent() || '';
				}
				function getApiContent() {
					return api.field.getValue() || '';
				}
				function setContent(x) {
					var apiContent = x || '';
					var editorContent = getEditorContent();
					if (apiContent !== editorContent) {
						editor.setContent(apiContent);
					}
				}
				setContent(api.field.getValue());
				api.field.onValueChanged(function(x) {
					if (listening) {
						setContent(x);
					}
				});
				function onEditorChange() {
					var editorContent = getEditorContent();
					var apiContent = getApiContent();
					if (editorContent !== apiContent) {
						listening = false;
						api.field.setValue(editorContent).then(function() {
							listening = true;
						}).catch(function(err) {
							console.log("Error setting content", err);
							listening = true;
						});
					}
				}
				var throttled = _.throttle(onEditorChange, 500, {leading: true});
				editor.on('change keyup setcontent blur', throttled);
			}
		});
	}

	function loadScript(src, onload) {
		var script = document.createElement('script');
		script.setAttribute('src', src);
		script.onload = onload;
		document.body.appendChild(script);
	}
	
	var tinymceUrl = "https://cb.unipegaso.it/assets/tinymce/tinymce.min.js";
	
	loadScript(tinymceUrl, function() {
		tinymceForContentful(api);
	});
});