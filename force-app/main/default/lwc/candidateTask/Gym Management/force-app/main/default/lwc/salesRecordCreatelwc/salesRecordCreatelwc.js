import { api, LightningElement, track } from 'lwc';
//import saveMemberProfile from '@salesforce/apex/profileMembershipController.saveMemberProfileRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import filterStaffName from '@salesforce/apex/membershipCreateRecordByApex.filterStaffName';

// SEND DATA IN CLASS APEX
import saveStaffRecord from '@salesforce/apex/membershipCreateRecordByApex.saveStaffRecord';

// SEND DATA IN CLASS APEX
import updateStaffDetails from '@salesforce/apex/membershipCreateRecordByApex.updateStaffDetails';

// RETREIVE DATA FOR FILTER ONE
import getStaffDetails from '@salesforce/apex/membershipCreateRecordByApex.getStaffDetails';

// RETREIVE DATA FOR FILTER TWO
import getEmailDetails from '@salesforce/apex/membershipCreateRecordByApex.getEmailDetails';

// IMPORT METHOD FOR TABLE
import manageStaffMethod from '@salesforce/apex/membershipCreateRecordByApex.manageStaffMethod';

//IMPORT STATIC RESOURCE
import Home_Button2 from '@salesforce/resourceUrl/Home_Button2';

export default class SalesRecordCreatelwc extends NavigationMixin(LightningElement) {

  Home = Home_Button2;

  @api staffFilterValue = '';
  @api staffName = '';
  @api EmailName = '';



  // Staff Data Array
  managementList = [];

  //show Modal on Click
  showModal = false;
  isenableViewForm = false;
  isdisableViewForm = false;

  //Open the Popup On click Of Add Staff
  openStaffForm() {
    this.showModal = true;
  }

  //Close the PopUp
  closeModal() { this.showModal = false; }
  close2Modal() { this.isenableViewForm = false; }
  close3Modal() { this.isdisableViewForm = false; }

  value = 'memberTitle';
  value1 = 'dealing with..';
  @track memberObFirstName;
  @track memberObLastName;
  @track memberObMidName;
  @track memberObjEmail;
  @track memberObjPhone;
  @track memberObjCity;
  @track memberObState;
  @track memberObCountry;
  @track memberObjPincode;
  @track memberObjJoiningDate;

  message;
  error;
  get options() {
    return [
      { label: 'Mr.', value: 'mr.' },
      { label: 'Ms.', value: 'ms.' },
      { label: 'Mrs.', value: 'mrs.' }
    ];
  }

  // ======================= VALUES OF FILTER - RECORD TYPE ======================= 


  get optionFilter() {
    return [
      { label: 'Housekeeping', value: 'Housekeeping' },
      { label: 'Sales Staff', value: 'sales_staff' },
      { label: 'Technician', value: 'Technician' }
    ];

  }

  // ======================= HANDLE FILTER  =======================

  handleFilter() {
    this.staffFilterValue = event.detail.value;
    console.log('Filter one', this.staffFilterValue);

    this.getitemAvailbles();
  }


  // ======================= FILTER ONE =======================

  searchStaffAction(event) {
    this.staffName = event.target.value;
    console.log('Search Staff', this.staffName);


    getStaffDetails({ searchKeyMember: this.staffName })
      .then(result => {
        this.managementList = result;
      })
      .catch(error => {
        console.log('Errorured:- ' + error.body.message);
      });
  }



  // ======================= FILTER TWO =======================

  getitemAvailbles() {

    filterStaffName({ staffNamecls: this.staffFilterValue })
      .then(result => {
        this.managementList = result;
      })
      .catch(error => {
        console.log('Errorured:- ' + error.body.message);
      })
  }

  // ======================= FILTER THREE =======================

  searchEmailAction(event) {
    this.EmailName = event.target.value;
    console.log('Search Email', this.EmailName);


    getEmailDetails({ searchKeyMember: this.EmailName })
      .then(result => {
        this.managementList = result;
      })
      .catch(error => {
        console.log('Errorured:- ' + error.body.message);
      });
  }

  // ======================= RETRIEVE TABLE VALUES =======================

  connectedCallback() {
    manageStaffMethod({})
      .then(result => {

        this.managementList = result;
        console.log('Data for Staff', this.managementList);


      })
      .catch(error => {
        console.log('Errorured:- ' + error.body.message);
      });
  }

  // ======================= HOME ICON NAVIGATION - CANCEL BUTTON =======================


  cancelButtonHandler(event) { this.showModal = false; }

  cancel2ButtonHandler(event) { this.isenableViewForm = false; }

  cancel3ButtonHandler(event) { this.isdisableViewForm = false; }


  //   ======================= STAFF HANDLER FORM  ======================= 


  memberHandleChange(event) {
    if (event.target.name == 'memberPicklisttitle') {
      this.titleValue = event.detail.value;
      // console.log('memberTitle = ' + this.titleValue);
    }

    if (event.target.name == 'memberFirstName') {
      this.memberObFirstName = event.target.value;
      // console.log('memberObName = ' + this.memberObFirstName);
    }
    if (event.target.name == 'memberLastName') {
      this.memberObLastName = event.target.value;
      //window.console.log('memberObName ##' + this.memberObName);
    }
    if (event.target.name == 'memberMidName') {
      this.memberObMidName = event.target.value;
    }
    if (event.target.name == 'memberEmail') {
      this.memberObjEmail = event.target.value;
    }
    if (event.target.name == 'memberPhone') {
      this.memberObjPhone = event.target.value;

    }
  }

  // ======================= HANDLE VIEW FORM =======================

  handleView(event) {

    this.isenableViewForm = true;

    let recordId = event.currentTarget.dataset.index;
    this.recordId = this.managementList[recordId];

    console.log('check edit form data =', this.recordId);

    if (this.recordId.First_Name__c != undefined) {
      this.editFirstName = this.recordId.First_Name__c;
      console.log("Name :::", JSON.stringify(this.editFirstName));
    }
    if (this.recordId.Email__c != undefined) {
      this.editEmail = this.recordId.Email__c;
      console.log("Email :::", JSON.stringify(this.editEmail));
    }
    if (this.recordId.Phone_Number__c != undefined) {
      this.editPhone = this.recordId.Phone_Number__c;
      console.log("Phone :::", JSON.stringify(this.editPhone__c));
    }

    if (this.recordId.Country__c != undefined) {
      this.editCountry = this.recordId.Country__c;
      console.log("Country :::", JSON.stringify(this.Phone__c));
    }


  }

  // ======================= HANDLE EDIT FORM =======================

  handleEdit(event) {

    this.isdisableViewForm = true;

    let recordId = event.currentTarget.dataset.index;
    this.recordId = this.managementList[recordId];

    console.log('check edit form data =', this.recordId);


    if (this.recordId.First_Name__c != undefined) {
      this.editFirstName = this.recordId.First_Name__c;
      console.log("Name :::", JSON.stringify(this.editFirstName));
    }
    if (this.recordId.Email__c != undefined) {
      this.editEmail = this.recordId.Email__c;
      console.log("Email :::", JSON.stringify(this.editEmail));
    }
    if (this.recordId.Phone_Number__c != undefined) {
      this.editPhone = this.recordId.Phone_Number__c;
      console.log("Phone :::", JSON.stringify(this.editPhone__c));
    }

    if (this.recordId.Country__c != undefined) {
      this.editCountry = this.recordId.Country__c;
      console.log("Country :::", JSON.stringify(this.Phone__c));
    }

  }


  //   ======================= HANDLER FOR EDIT FORM  ======================= 

  handlerFirstname(event) {
    this.editFirstName = event.currentTarget.value;
    console.log('First Name::', JSON.stringify(event.currentTarget.value));
  }

  handlerEmail(event) {
    this.editEmail = event.currentTarget.value;
    console.log('Email::', JSON.stringify(event.currentTarget.value));
  }

  handlerPhone(event) {
    this.editPhone = event.currentTarget.value;
    console.log('Phone::', JSON.stringify(event.currentTarget.value));
  }


  //   ======================= SUBMIT STAFF DATA  ======================= 
  //   ======================= SUBMIT STAFF DATA  =======================

  submitAction() {


    if (this.memberObFirstName == '' || this.memberObFirstName == undefined || this.memberObFirstName == null) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: 'Required Field Missing',
          message: 'Please enter the required fields.',
          variant: 'error',
        })
      );
      return false;
    }
    saveStaffRecord({
      cardTitlePick: this.titleValue,
      cardFirstName: this.memberObFirstName,
      cardMiddleName: this.memberObMidName,
      cardLastName: this.memberObLastName,
      cardEmail: this.memberObjEmail,
      cardPhone: this.memberObjPhone
    })
      .then(result => {
        this.message = result;
        this.error = undefined;
        if (this.message !== undefined) {
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Created Successfully',
              message: 'Record was created successfully',
              variant: 'success',
            }),
          );
          window.location.reload();
        }
      })
      .catch(error => {
        this.message = undefined;
        this.error = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error creating record',
            message: error.body.message,
            variant: 'error',
          }),
        );
      });


  }


  // ======================= UPDATE THE EDIT FORM DETAILS METHOD - APEXCLASS  ======================= 

  updateDetails() {
    console.log('IDhere', this.recordId.Id);
    updateStaffDetails({
      recordId: this.recordId.Id,
      cardTitlePick: this.titleValue,
      cardFirstName: this.editFirstName,
      cardMiddleName: this.memberObMidName,
      cardLastName: this.memberObLastName,
      cardEmail: this.editEmail,
      cardPhone: this.editPhone

    })
      .then(result => {
        this.message = result;
        this.error = undefined;
        if (this.message !== undefined) {
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Updated Successfully',
              message: 'Member record ' + this.editFirstName + ' updated.',
              variant: 'success',
            }),
          );
          window.location.reload();
        }
      })
      .catch(error => {
        this.message = undefined;
        this.error = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error Updating Staff Record',
            message: error.body.message,
            variant: 'error',
          }),
        );

      });
    this.isdisableViewForm = false;


  }


  // ======================= BACK BUTTON HANDLER  ======================= 

  backButtonHandler(event) {

    let cmpDef = {
      componentDef: "c:mainGymPageLwc",

      attributes: {
      }
    };
    let encodedDef = btoa(JSON.stringify(cmpDef));
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: "/one/one.app#" + encodedDef
      }
    });
  }
}