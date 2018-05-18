({
	loadDataToCalendar :function(component,helper,events){
		
		//Set up FullCalendar		
		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: ''
			},
			defaultDate: new Date(),
			defaultView: 'agendaWeek',
			minTime: '06:00:00',
			maxTime: '20:00:00',
			timezone: 'local',
			displayEventTime: true,
			nowIndicator: true,
			editable: false,
			eventLimit: true,
			events: events,
			schedulerLicenseKey: component.get('v.license'),
            allDaySlot: false,

            //Action when user clicks in a time slot
			dayClick: function(date,jsEvent,view) {

				var modal = component.get('v.modal');

				//Format date to display in the modal picklists
				var datetime = new Date(date.format());
				var hours = datetime.getHours();
				var minutes = datetime.getMinutes();

				var ampm = hours >= 12 ? 'pm' : 'am';
				hours = hours % 12;
				hours = hours ? hours : 12; // the hour '0' should be '12'
				hours = ("0" + hours).slice(-2);
				minutes = ("0" + minutes).slice(-2);

				//Set attributes in modal component
				modal.set('v.startDateTime', $A.localizationService.formatDate(date));
				modal.set('v.startHour', hours);
				modal.set('v.startMinute', minutes);
				modal.set('v.startAMPM', ampm);
				modal.set('v.lead', component.get('v.lead'));
				modal.set('v.events', component.get('v.events'));

				//Call Modal
				modal.displayModal();
			},
		});
	},

	tranformToFullCalendarFormat : function(component,events) {
		var eventArr = [];
		for(var i = 0;i < events.length;i++){
			eventArr.push({
				'id':events[i].Id,
				'start':events[i].StartDateTime,
				'end':events[i].EndDateTime,
				'title':events[i].Subject + ' (' + events[i].ShowAs + ')',
				'showAs':events[i].ShowAs
			});
		}
		return eventArr;
	},

	fetchEvents : function(component, helper) {

		var action = component.get("c.getLead");

		action.setParams({
			"recordId": component.get("v.recordId")
		});

		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS"){

				var lead = response.getReturnValue();
				component.set('v.lead',lead);
				helper.fetchEventData(component,helper,lead);

			}
		});

		$A.enqueueAction(action); 

	},

	fetchEventData: function(component,helper,lead){

		var action = component.get("c.getEventsByOwnerId");

		action.setParams({
			"ownerId": lead.OwnerId
		});

		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS"){

				var eventArr = helper.tranformToFullCalendarFormat(component,response.getReturnValue());
				helper.loadDataToCalendar(component,helper,eventArr);
				component.set("v.events",eventArr);
				helper.fetchEventMetadata(component,helper);

			}
		});

		$A.enqueueAction(action); 
	},

	fetchEventMetadata : function(component, helper) {

		var action = component.get("c.getSubjectPicklistValues");
		action.setCallback(this, function(response) {
			var state = response.getState();
			if (component.isValid() && state === "SUCCESS"){

				component.set("v.subjectPicklistValues",response.getReturnValue());
				var modal = component.get('v.modal');
				modal.set('v.subjectPicklistValues', response.getReturnValue());

			}
		});

		$A.enqueueAction(action);

		var action2 = component.get("c.getShowAsPicklistValues");
		action2.setCallback(this, function(response) {
			var state = response.getState();
			if(component.isValid() && state === "SUCCESS"){

				component.set("v.showAsPicklistValues",response.getReturnValue());
				var modal = component.get('v.modal');
				modal.set('v.showAsPicklistValues', response.getReturnValue());

			}
		});

		$A.enqueueAction(action2);
	}
})