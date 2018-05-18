public class CreateAppointmentController {

	@AuraEnabled
	public static Lead getLead(Id recordId){

		return [SELECT Id, Name, Email, Phone, Address, OwnerId, Owner.Name, Owner.Email, Owner.Phone FROM Lead WHERE Id =:recordId ];
	}

	@AuraEnabled
	public static List<Event> getEventsByOwnerId(Id ownerId){

		return [SELECT Id,StartDateTime,EndDateTime,Subject,ShowAs,Location,OwnerId FROM Event WHERE OwnerId = :ownerId ];
	}

	@AuraEnabled
	public static List<String> getSubjectPicklistValues(){
		List<String> values = new List<String>();

		Schema.DescribeFieldResult fieldResult = Event.Subject.getDescribe();
		List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
		
		for( Schema.PicklistEntry f : ple) {
		   values.add(f.getValue());
		}
		return values;
	}

	@AuraEnabled
	public static List<String> getShowAsPicklistValues(){
		List<String> values = new List<String>();

		Schema.DescribeFieldResult fieldResult = Event.ShowAs.getDescribe();
		List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
		
		for( Schema.PicklistEntry f : ple) {
		   values.add(f.getValue());
		}
		return values;
	}
}