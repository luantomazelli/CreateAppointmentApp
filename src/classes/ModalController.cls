public class ModalController {

	@AuraEnabled
	public static Id insertEvent(String leadId,String ownerId,String email,String phone,String location,String subject,String showAs,DateTime startDateTime,DateTime endDateTime){

		//convert lead into opportunity
		Lead lead = [SELECT Id FROM Lead WHERE Id =:leadId ];

		Database.LeadConvert lc = new database.LeadConvert();
		lc.setLeadId(lead.Id);

		LeadStatus convertstatus = [select Id, MasterLabel from LeadStatus where IsConverted=true limit 1];
		lc.setConvertedStatus(convertStatus.MasterLabel);

		Database.LeadConvert[] lcArray = new Database.LeadConvert[] {lc};

		Database.LeadConvertResult[] results = Database.convertLead(lcArray);

		Event event = new Event(
			WhoId = results[0].getContactId(),
			WhatId = results[0].getOpportunityId(),
			OwnerId = ownerId,
			Location = location,
			Subject = subject,
			ShowAs = showAs,
			StartDateTime = startDateTime,
			EndDateTime = endDateTime
		);

		insert event;

		return results[0].getOpportunityId();
	}
}