({
	afterScriptsLoaded: function(component,event,helper){

		$A.createComponent(
			'c:Modal',
			{ },
			function(modal){
				component.set('v.modal', modal);
				helper.fetchEvents(component,helper);
			}
		);
	}
})