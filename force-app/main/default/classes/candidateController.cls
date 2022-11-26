public with sharing class candidateController {
    
    
    @AuraEnabled
    //Method for getting Candidate Record
    public static Candidate__c createCandidate(String FirstNamecls, String MiddleNamecls, String LastNamecls, String Pancls, String Phonecls, String Emailcls, String Addresscls){
        Candidate__c c = new Candidate__c();
        
        c.First_Name__c = FirstNamecls;
        c.Middle_Name__c = MiddleNamecls;
        c.Last_Name__c = LastNamecls;
        
        c.Pan_Number__c = Pancls;
        c.Phone__c = Phonecls;
        c.Email__c = Emailcls;
        c.Address__c = Addresscls; 
        
        insert c;
        Candidate__c c1 = [select Id from Candidate__c where Id=: c.Id];
        return c1;        
    }
    
    //<<-------------------------------------------------------------------------------------------->>
    //METHOD FOR INPUT THE VALUES OF QUALIFICATION OBJECT IN THE FORM OF LIST

    ////<<-------------------------------------------------------------------------------------------->>
    
    @AuraEnabled
    public static String createQualificationRecord(String quList, String qualId){
            List<Qualification__c > qualificationToInsert = new List<Qualification__c >();
        List<QualificationObj> lstObj =  (List<QualificationObj>) JSON.deserialize(quList, List<QualificationObj>.class);
        
            if(lstObj.size()>0){
                for(QualificationObj qual:lstObj){
                    
                    Qualification__c qualData = new Qualification__c();
                    
                    qualData.Select_Candidate__c = qualId;
                    qualData.Select_Qualification__c = qual.selectqualification;  
                    qualData.Year_of_passing__c = qual.yearOfpassing;
                    qualData.Percentage__c = qual.percentage;
                    qualificationToInsert.add(qualData);
                }
                system.debug('RESULT OF QU LIST ==>> '+lstObj);
                
            }
            if(qualificationToInsert.size()>0){
                insert qualificationToInsert;
                return 'success';
            }else{
                return 'unsuccess';
            }
    }
    public class QualificationObj{
        @AuraEnabled 
        public String qualId {get;set;}
        @AuraEnabled 
        public String selectqualification {get;set;}
        @AuraEnabled
        public String yearOfpassing {get;set;}
        @AuraEnabled
        public Decimal percentage {get;set;}
    }
    
    //<<-------------------------------------------------------------------------------------------->>

    ////<<-------------------------------------------------------------------------------------------->>
    
    
    @AuraEnabled
    // @method uploadFile() 
    public static String uploadFile(String base64, String filename, String recordId) {
        ContentVersion cv = createContentVersion(base64, filename);
        ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
        if (cv == null || cdl == null) { return null; }
        return cdl.Id;
    }
    
    // @method createContentVersion() [private]
    private static ContentVersion createContentVersion(String base64, String filename) {
        ContentVersion cv = new ContentVersion();
        cv.VersionData = EncodingUtil.base64Decode(base64);
        cv.Title = filename;
        cv.PathOnClient = filename;
        try {
            insert cv;
            return cv;
        } catch(DMLException e) {
            System.debug(e);
            return null;
        }
    }
    
    // @method createContentLink() [private]
    private static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
        if (contentVersionId == null || recordId == null) { return null; }
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [
            SELECT ContentDocumentId 
            FROM ContentVersion 
            WHERE Id =: contentVersionId
        ].ContentDocumentId;
        cdl.LinkedEntityId = recordId;
        // ShareType is either 'V', 'C', or 'I'
        // V = Viewer, C = Collaborator, I = Inferred
        cdl.ShareType = 'V';
        try {
            insert cdl;
            return cdl;
        } catch(DMLException e) {
            System.debug(e);
            return null;
        }
    }
    
    /* This code is used for sending otp 
     * defintion :  generating random numnber
     * Code By Shubham Vishnoi*/
    public static Integer  getNumber(){
        return Math.round((Math.random() * (900000) + 100000));
    } 
    
    /* This code is used for sending OTP to the Email field we get from LWC
     * Code By Shubham Vishnoi*/
    
    @AuraEnabled
    public static void sendOTP(String EmailField){
    Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
    message.toAddresses = new String[] { EmailField };
        message.optOutPolicy = 'FILTER';
    message.subject = 'OTP Verification';
    message.plainTextBody = String.valueOf(candidateController.getNumber());
    Messaging.SingleEmailMessage[] messages =   new List<Messaging.SingleEmailMessage> {message};
        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
    
    if (results[0].success) 
    {
        System.debug('The email was sent successfully.');
    } else 
    {
        System.debug('The email failed to send: ' + results[0].errors[0].message);
    }
    
    }
    
}