import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommonUtilsProvider, CallingCard } from '../../providers/common-utils/common-utils';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  ccard:CallingCard = {
    name:"",
    access:"18664947291",
    pin:""
  }

  constructor(public navCtrl: NavController, public utils:CommonUtilsProvider) {

  }

  ionViewWillEnter() {
    this.utils.getCallingCard()
    .then (ccard => {
      console.log ("Got calling card:" + JSON.stringify(ccard));
      if (ccard) this.ccard = ccard;
    })
  }

  ionViewDidLeave() {
    if (this.ccard.access) {
      console.log ("SAVING calling card details");
      this.utils.setCallingCard(this.ccard);
    }
    else {
      console.log ("Not saving details, no access #");
    }
    
  }

}
