({
	displayModal : function(component) {

		var detailsContainer = component.find('details-container');
		$A.util.removeClass(detailsContainer, 'toggle');
		var detailsModal = component.find('details-modal');
		$A.util.addClass(detailsModal, 'slds-fade-in-open');
		var detailsModalBackdrop = component.find('details-backdrop');
		$A.util.addClass(detailsModalBackdrop, 'slds-backdrop_open');
		
		component.find("hoursPicklist").set("v.value", component.get("v.startHour"));
		component.find("minutesPicklist").set("v.value", component.get("v.startMinute"));
		component.find("ampmPicklist").set("v.value", component.get("v.startAMPM"));
	},

	closeModal: function(component) {

		var detailsContainer = component.find('details-container');
		$A.util.addClass(detailsContainer, 'toggle');
		var detailsModal = component.find('details-modal');
		$A.util.removeClass(detailsModal, 'slds-fade-in-open');
		var detailsModalBackdrop = component.find('details-backdrop');
		$A.util.removeClass(detailsModalBackdrop, 'slds-backdrop--open');

		var confirmation = component.find('confirmation');
		$A.util.addClass(confirmation, 'slds-hide');
		var form = component.find('form');
		$A.util.removeClass(form, 'slds-hide');

		component.set('v.doubleBooking', false);
	},

	saveEvent: function(component,helper,startDateTime,endDateTime) {

		var lead = component.get('v.lead');
		var subject = component.find('subject').get('v.value');
		var showAs = component.find('showAs').get('v.value');

		//Set address as a String
		var location = '';
		if (lead.Address.street){
			location += lead.Address.street +', ';
		}
		if (lead.Address.city){
			location += lead.Address.city +', ';
		}
		if (lead.Address.state){
			location += lead.Address.state +', ';
		}
		if (lead.Address.postalCode){
			location += lead.Address.postalCode;
		}

		var action = component.get("c.insertEvent");

		action.setParams({
			"leadId": lead.Id,
			"ownerId": lead.OwnerId,
			"email": lead.Email,
			"phone": lead.Phone,
			"location": location,
			"subject": subject,
			"showAs": showAs,
			"startDateTime": startDateTime,
			"endDateTime": endDateTime
		});

		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS"){

				//Redirect user to new Opportunity record
				var recordId = response.getReturnValue();
				window.parent.location = '/' + recordId;
				
			}
		});

		$A.enqueueAction(action);
	}
})