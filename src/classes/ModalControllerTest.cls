@isTest(SeeAllData = false)
public class ModalControllerTest {

	@isTest
	static void testInsertEvent(){

		Test.startTest();

		Id userId = UserInfo.getUserId();
		DateTime dt = DateTime.newInstance(2014, 9, 15, 12, 30, 0);
		DateTime dtEnd = DateTime.newInstance(2014, 9, 15, 13, 30, 0);

		Lead lead = new Lead(
			LastName = 'Lead LastName',
			FirstName = 'Lead FirstName',
			Company = 'Lead Company',
			Email = 'leademail@gmail.com',
			Phone = '778.778.7878',
			OwnerId = userId
		);

		insert lead;

		Id result = ModalController.insertEvent(lead.Id, userId, 'email@co.co', '7787787878','location','subject','Busy',dt,dtEnd);

		Test.stopTest();

		Lead convertedLead = [SELECT Id, ConvertedOpportunityId FROM Lead WHERE Id = :lead.Id];

		System.assertEquals(result, convertedLead.ConvertedOpportunityId);
	}
}