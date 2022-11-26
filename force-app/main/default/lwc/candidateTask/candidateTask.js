import { LightningElement, wire, track, api } from 'lwc';

// Importing Apex Class Method
import createCandidate from '@salesforce/apex/candidateController.createCandidate';
import sendOTP from '@salesforce/apex/candidateController.sendOTP';
import createQualificationRecord from '@salesforce/apex/candidateController.createQualificationRecord';

// PICKLIST FIELD REQUIREMENTS
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import QUALIFICATION_OBJECT from '@salesforce/schema/Qualification__c';

import SELECTQUALIFICATION_FIELD from '@salesforce/schema/Qualification__c.Select_Qualification__c';

// Import Upload File
import uploadFile from '@salesforce/apex/candidateController.uploadFile';

// Importing to show Toast Notifications
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class candidateTask extends LightningElement {

    //<<-------------------------------------------------------------------------------------------->>
    @api recordId;
    @track error;
    @track candidateId;
    @track qualificationId;
    @track value;
    EmailToAddress;


    // FOR QUALIFICATION
    @track qualList = [];
    @track index = 0;
    @api qualRecordId;
    isLoaded = false;

    //<<-------------------------------------------------------------------------------------------->>

    // Candidate object has record Information
    @track getCandidateRecord = {
        FirstName: '',
        MiddleName: '',
        LastName: '',
        Pan: '',
        Phone: '',
        Email: '',
        Address: ''

    }

    //input field for qualification using api 
    @api qual = {
        selectqualification: '',
        fileShivang: '',
        yearOfpassing: '',
        percentage: 0,
        key: this.index
    }


    // PICKLIST FIELD SELECT QUALIFICATION

    @wire(getObjectInfo, { objectApiName: QUALIFICATION_OBJECT })

    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: SELECTQUALIFICATION_FIELD })

    SelectqualPicklistValues;









    //<<-------------------------------------------------------------------------------------------->>

    // ADD ROW BUTTON WORK

    addRow() {

        this.index++;
        //var i = JSON.parse(JSON.stringify(this.index));
        var i = this.index;

        this.qual.key = i;
        this.qualList.push(JSON.parse(JSON.stringify(this.qual)));

        console.log('Enter ', this.qualList);
    }

    // REMOVE ROW

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

    //<<-------------------------------------------------------------------------------------------->>

    

    //<<-------------------------------------------------------------------------------------------->>
    // Putting the values with the help of OnChange Methods - Candidate

    handleFirstNameChange(event) {
        this.getCandidateRecord.FirstName = event.target.value;
        console.log('First Name ==> ' + this.getCandidateRecord.FirstName);
    }

    handleMiddleNameChange(event) {
        this.getCandidateRecord.MiddleName = event.target.value;
        console.log('Middle Name ==> ' + this.getCandidateRecord.MiddleName);
    }

    handleLastNameChange(event) {
        this.getCandidateRecord.LastName = event.target.value;
        console.log('Last Name ==> ' + this.getCandidateRecord.LastName);
    }

    handlePanChange(event) {
        this.getCandidateRecord.Pan = event.target.value;
        console.log('Pan Number ==> ' + this.getCandidateRecord.Pan);

    }

    handlePhoneChange(event) {
        this.getCandidateRecord.Phone = event.target.value;
        console.log('Phone ==> ' + this.getCandidateRecord.Phone);
    }

    handleEmailChange(event) {
        this.getCandidateRecord.Email = event.target.value;
        this.EmailToAddress = event.target.value;
        console.log('Email ==> ' + this.getCandidateRecord.Email);
    }

    handleAddressChange(event) {
        this.getCandidateRecord.Address = event.target.value;
        console.log('Address ==> ' + this.getCandidateRecord.Address);
    }

    //<<-------------------------------------------------------------------------------------------->>

    // Putting the values with the help of OnChange Methods ----- NEW QUALIFICATION WITH JS
    
    handleQualificationChange(event) {

        this.value = event.detail.value;

    }
    

    handleYearOfPassingChange(event) {

        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var qVar = this.qualList[key];
        this.qualList[key].yearOfpassing = event.target.value;
        console.log('Year qualList year of passing= ' +this.qualList[key].yearOfpassing);
    }

    handlePercentageChange(event) {

        var selectedRow = event.currentTarget;
        var key = selectedRow.dataset.id;
        var qVar = this.qualList[key];
        this.qualList[key].percentage = event.target.value;
        console.log('Year qualList Percentage ==> ' +this.qualList[key].percentage);
    }

    // File Upload - Upload Button
    fileData
    handleopenfileUpload(event) {
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.recordId
            }
            console.log(this.fileData)
        }
        reader.readAsDataURL(file)
    }

    //<<-------------------------------------------------------------------------------------------->>
    // SUBMIT BUTTON METHOD
    // SUBMIT BUTTON METHOD
    // SUBMIT BUTTON METHOD
    // SUBMIT BUTTON METHOD
    //<<-------------------------------------------------------------------------------------------->>

    handleSave() {
        alert('Submit Clicked');

        // CANDIDATE METHOD CALLING

        createCandidate({ FirstNamecls: this.getCandidateRecord.FirstName, MiddleNamecls: this.getCandidateRecord.MiddleName, LastNamecls: this.getCandidateRecord.LastName, Pancls: this.getCandidateRecord.Pan, Phonecls: this.getCandidateRecord.Phone, Emailcls: this.getCandidateRecord.Email, Addresscls: this.getCandidateRecord.Address })
            .then(result => {
                this.getCandidateRecord = {};
                this.candidateId = result.Id;

                window.console.log('Results ==> ' + result);

                // Show Success Message
                this.dispatchEvent(new ShowToastEvent({
                    tite: 'Success',
                    message: 'Record Created Successfully',
                    variant: 'success'

                }),);

                //QUALIFICATION METHOD

                

                createQualificationRecord({ quList: JSON.stringify(this.qualList) , qualId: this.candidateId })
                    .then(result => {
                        this.message = result;
                        this.error = undefined;
                        if (this.message !== undefined) {
                            this.qual.selectqualification = '';
                            this.qual.yearOfpassing = '';
                            this.qual.percentage = '';
                        }
                    })
                    .catch(errorQ => {
                        this.error = errorQ.message;
                        console.error(errorQ);
                    });


                    // FILE METHOD CALLING
        const { base64, filename, recordId } = this.fileData
        uploadFile({ base64, filename, recordId: this.candidateId}).then(result => {
            this.fileData = null
            let title = `${filename} uploaded successfully!!`
            this.toast(title)
        })



            })
            .catch(errorM => {
                this.error = errorM.message;
                console.error(errorM);
            });




        // FILE METHOD CALLING
        const { base64, filename, recordId } = this.fileData
        uploadFile({ base64, filename, candidateId }).then(result => {
            this.fileData = null
            let title = `${filename} uploaded successfully!!`
            this.toast(title)
        })
    }

    toast(title) {
        const toastEvent = new ShowToastEvent({
            title,
            variant: "success"
        })
        this.dispatchEvent(toastEvent)

    }

    //<<-------------------------------------------------------------------------------------------->>

    // SUBMIT VERIFY PHONE METHOD

    handlePhoneVerify() {
        alert('Otp Sent');
    }

    //<<-------------------------------------------------------------------------------------------->>

    // SUBMIT VERIFY EMAIL METHOD

    handleEmailVerify() {
        sendOTP({ EmailField: this.EmailToAddress }).then(result => {
            alert('OTP send successfully. Please check your email');
        }).catch(error => {
            alert('Invalid Email . Please check . Thank You!!')
        })
    }

    //<<-------------------------------------------------------------------------------------------->>

    //Qualification submit Method - TESTING VERSION 1.O SHIVANG










}

