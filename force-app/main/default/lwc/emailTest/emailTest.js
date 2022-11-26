import { api, track, LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import jsOTPResource from '@salesforce/resourceUrl/jsOTP';
import sendOTP from "@salesforce/apex/EmailTesting.sendOTP";
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
export default class otp extends LightningElement {
    @api recordId;
    @api title;
    @api iconName;
    secret='12345';
    code;
    refreshCounter;
    counter=1;
    @track loaded=false;
    @track disabled=false;
    connectedCallback()
    {
        loadScript(this, jsOTPResource).then(() => {
            this.loaded=true;
        });
    }
    get ringCounter() {
        return (100 / 30) * this.refreshCounter;
    }



   get ringVariant() {
        if (this.refreshCounter < 3) {
            return 'expired'
        }
        if (this.refreshCounter < 10) {
            return 'warning'
        }
        return 'base';
    }
    generateOTP() {
        if(this.loaded)
        {
            this.code = new jsOTP.totp().getOtp(this.secret);
            this.sendOTP(this.code);
            this.disabled=true;
            var interval=setInterval(function() {
                if(this.refreshCounter==1)
                {
                    this.counter=1;
                    this.refreshCounter=0;
                    this.disabled=false;
                    clearInterval(interval);
                }
                this.refreshCounter = 50 - (this.counter++);
            }.bind(this), 1000);
        }
    }
    sendOTP(code)
    {
        sendOTP({
            recordId: this.recordId,
            otp: code
        }).then(res => {
            this.showMessage('Notification','OTP sent to your Email','success');
        });
    }
    verifyOTP(){
        var input=this.template.querySelector('.verify');
        var otp=input.value;
        if(otp!=undefined && otp!==null)
        {
            if(this.code!==otp)
            {
                this.showMessage('Notification','OTP is not matching, please try again','error');
            }
            else{
                this.showMessage('Notification','OTP verification is completed','success');
            }
        }
    }
    showMessage( t, m,type ){
        const toastEvt = new ShowToastEvent({
            title: t,
            message:m,
            variant: type
        });
        this.dispatchEvent(toastEvt);
    };
}