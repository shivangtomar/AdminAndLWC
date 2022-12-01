import { LightningElement, track,api } from 'lwc';

//Importing Apex Class Method

//import comapanyInfo from '@salesforce/apex/company_details.comapanyInfo';
import ComapanyInfo from '@salesforce/apex/company_details.comapanyInfo';
//import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class experience_form extends LightningElement {
    @track cname;
    @track fromdate;
    @track todate;
    @track Currentlyworking;
    @track getCompanyDetailRecord;



    @track qualList = [{
        cname: '',
        fromdate: '',
        Currentlyworking: '',
        getCompanyDetailRecord: ''
        
    }];


    @api qual = {
        cname: '',
        fromdate: '',
        Currentlyworking: '',
        getCompanyDetailRecord: ''
    }


    /* handelcname(event) {
        this.cname = event.detail.value;

    }

    handelfromdate(event) {
        this.fromdate = event.detail.value;

    }

    handeltodate(event) {
        this.todate = event.detail.value;

    }

    handelCurrentlyworking(event) {
        this.Currentlyworking = event.detail.value;
  
    }
 */


   /*  Handelchange */



  /*  handlecnameChange(event) {  
        this.getCompanyDetailRecord = event.detail.value;  
      }*/


      handlecnameChange(event) {
        this.getCompanyDetailRecord = event.target.value;
        console.log('Company Name ==> ' + this.getCompanyDetailRecord);
    }

    handlefromdateChange(event) {  
        this.getCompanyDetailRecord = event.detail.value;  
        console.log ('From Date ==>' + this.getCompanyDetailRecord);
      }
      handletodateChange(event) {
        this.getCompanyDetailRecord = event.detail.value;
        console.log ('To Date ==>' + this.getCompanyDetailRecord);
      }

      handleCurrentlyworkingChange(event) {
        this.getCompanyDetailRecord =event.detail.value;
        console.log ('Currently Working Here ? ==>' + this.getCompanyDetailRecord);
    }

    // ADD ROW BUTTON

    addRow() {

        this.index++;
        var i = this.index;
        this.qual.key = i;

        this.qualList.push(JSON.parse(JSON.stringify(this.qual)));

    }

    // REMOVE ROW BUTTON

    removeRow(event) {
        this.isLoaded = true;
        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        if (this.qualList.length > 1) {
            this.qualList.splice(key, 1);
            this.index--;
            this.isLoaded = false;
        } else if (this.qualList.length == 1) {
            this.qualList = [];
            this.index = 0;
            this.isLoaded = false;
        }
    }



    handlecnameChange(event) {

        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var qVar = this.qualList[key];
        this.qualList[key].selectqualification = event.detail.value;

    }

    handlefromdateChange(event) {

        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var qVar = this.qualList[key];
        this.qualList[key].selectqualification = event.detail.value;

    }


    handletodateChange(event) {

        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var qVar = this.qualList[key];
        this.qualList[key].selectqualification = event.detail.value;

    }

    handleCurrentlyworkingChange(event) {

        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var qVar = this.qualList[key];
        this.qualList[key].selectqualification = event.detail.value;

    }
    





    experiencehandleClick(){
        ComapanyInfo({ 
        cname : this.firstname,
        fromdate : this.fromdate,
        todate : this.todate,
        Currentlyworking : this.Currentlyworking
       
    })
.then(result =>{
   // alert('result ===> '+JSON.stringify(result));
})
    
    .catch(error =>{
        this.error = error.message;
        alert(JSON.stringify(error));
    })

      
  }



}