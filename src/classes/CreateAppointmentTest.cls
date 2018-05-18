@isTest(SeeAllData = false)
public class CreateAppointmentTest {

	@isTest
	static void testGetEventsByOwnerId(){

		Test.startTest();
		Id userId = UserInfo.getUserId();

		Lead lead = new Lead(
			LastName = 'Lead LastName',
			FirstName = 'Lead FirstName',
			Company = 'Lead Company',
			Email = 'leademail@gmail.com',
			Phone = '778.778.7878',
			OwnerId = userId
		);

		insert lead;

		Test.stopTest();

		Lead result = CreateAppointmentController.getLead(lead.Id);

		System.assertEquals(lead.Id, result.Id);
		System.assertEquals(lead.Email, result.Email);
		System.assertEquals(lead.Phone, result.Phone);
		System.assertEquals(lead.OwnerId, result.OwnerId);
		System.assertEquals(lead.Owner.Name, result.Owner.Name);
	}

	@isTest
	static void getEventsByOwnerId(){

		Test.startTest();

		Id userId = UserInfo.getUserId();
		DateTime dt = DateTime.newInstance(2014, 9, 15, 12, 30, 0);
		DateTime dtEnd = DateTime.newInstance(2014, 9, 15, 13, 30, 0);

		Event event = new Event(
			ActivityDateTime = dt,
			StartDateTime = dt,
			EndDateTime = dtEnd,
			DurationInMinutes = 60,
			Location = 'Location',
			Subject = 'Busy',
			OwnerId = userId
		);

		insert event;

		Test.stopTest();

		List<Event> results = CreateAppointmentController.getEventsByOwnerId(userId);
		Event result = new Event();

		for (Event r : results){
			if (r.Id == event.Id){
				result = r;
			}
		}

		System.assertEquals(event.Id, result.Id);
		System.assertEquals(event.StartDateTime, result.StartDateTime);
		System.assertEquals(event.EndDateTime, result.EndDateTime);
		System.assertEquals(event.Location, result.Location);
		System.assertEquals(event.Subject, result.Subject);
		System.assertEquals(event.OwnerId, result.OwnerId);
	}

	@isTest
	static void testGetSubjectPicklistValues(){

		List<String> values = new List<String>();
		List<String> results = new List<String>();

		Schema.DescribeFieldResult fieldResult = Event.Subject.getDescribe();
		List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
		
		for( Schema.PicklistEntry f : ple) {
		   values.add(f.getValue());
		}

		results = CreateAppointmentController.getSubjectPicklistValues();

		System.assertEquals(values.size(), results.size());
	}

	@isTest
	static void testGetShowAsPicklistValues(){

		List<String> values = new List<String>();
		List<String> results = new List<String>();

		Schema.DescribeFieldResult fieldResult = Event.ShowAs.getDescribe();
		List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
		
		for( Schema.PicklistEntry f : ple) {
		   values.add(f.getValue());
		}
		
		results = CreateAppointmentController.getShowAsPicklistValues();

		System.assertEquals(values.size(), results.size());
	}

}