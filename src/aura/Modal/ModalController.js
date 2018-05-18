({
	displayModal: function(component, event, helper) {
		component.set("v.isOpen", true);
		helper.displayModal(component);
	},

	closeModal: function(component, event, helper) {
		component.set("v.isOpen", false);
		helper.closeModal(component);
	},

	saveEvent: function(component, event, helper) {

		//Format date to correct format
		var startDate = component.get('v.startDateTime');

		var hours = component.find('hoursPicklist').get('v.value');
		var minutes = component.find('minutesPicklist').get('v.value');
		var ampm = component.find('ampmPicklist').get('v.value');

		var hour = parseInt(hours);
		if (ampm == "pm" && hour != 12){
			hour = hour + 12;
		}
		if (ampm == "am" && hour == 12){
			hour = 0;
		}

		var startDateTime = new Date(startDate);
		startDateTime.setHours(hour);
		startDateTime.setMinutes(parseInt(minutes));

		var endDateTime = new Date(startDateTime);
		var endHour = parseInt(endDateTime.getHours()) + 1;
		endDateTime.setHours(endHour);

		//validate time is between 6am-8pm
		if (startDateTime.getHours() < 6 || endDateTime.getHours() > 20 || (endDateTime.getHours() == 20 && endDateTime.getMinutes() > 0) || startDateTime.getDate() != endDateTime.getDate()){
			//invalid time message
			alert('Invalid time slot! Please select a valid time slot (6am-8pm)!');

		} else {

			var skipSave = false;

			//Check for conflicting events
			if (!component.get('v.doubleBooking')){

				var events = component.get('v.events');
				console.log(events);

				for (var i=0; i<events.length; i++){

					var eventStart = new Date(events[i].start);
					var eventEnd = new Date(events[i].end);

					if (events[i].showAs == "Busy"){

						if ((startDateTime > eventStart && startDateTime < eventEnd) || (endDateTime > eventStart && endDateTime < eventEnd)){

							component.set('v.doubleBooking', true);

							//Display confirmation message for double booking
							var confirmation = component.find('confirmation');
							$A.util.removeClass(confirmation, 'slds-hide');
							var form = component.find('form');
							$A.util.addClass(form, 'slds-hide');

							skipSave = true;
						}
					}
				}
			}

			//If no event conflict or user confirms double booking, create new Event
			if (!skipSave){
				component.set('v.doubleBooking', false);
				helper.saveEvent(component,helper,startDateTime,endDateTime);	
			}
		}		
	}
})