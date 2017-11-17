import { Component, ViewChild } from '@angular/core';
import { List, NavController, NavParams } from 'ionic-angular';
import { CommonUtilsProvider, CallingCard } from '../../providers/common-utils/common-utils';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {
  @ViewChild(List) list: List;

  ccard:CallingCard[] = [{
    name:"default",
    access:"18664947291",
    pin:"",
    order: []
  }];

  isEdit:boolean = false;
  cardNdx:number = 0;

 

  constructor(public navCtrl: NavController, public navParams:NavParams, public utils:CommonUtilsProvider) {
    

  }

  toggleEdit() {
    console.log ("Closing");
    this.list.closeSlidingItems();  
    setTimeout (_=> {this.isEdit = !this.isEdit;},400);
       
  }

  // modify # of seconds of pause
  changePause(item, byVal) {
    item.value = item.value + byVal;
    if (item.value < 2) item.value = 2;
    if (item.value > 10) item.value = 10;
  }

  // inserts the right code in the order list 
  addSequence(code) {
    if (!this.isEdit) return;
    console.log ("ccard="+JSON.stringify(this.ccard))
    if (code=='access') {
      code = this.ccard[this.cardNdx].access;
      if (!code) {
        this.utils.presentToast("No access number entered", "error");
        return;
      }
    } 
    if (code == 'pin') {
      code = this.ccard[this.cardNdx].pin;
      if (!code) {
        this.utils.presentToast("No PIN number entered", "error");
        return;
      }
    } 
    let value=0;
    if (code=='pause') value=2;

    this.ccard[this.cardNdx].order.push ({name:code, value:value});
  }

  reorderItems(indexes) {
    let element = this.ccard[this.cardNdx].order[indexes.from];
    this.ccard[this.cardNdx].order.splice(indexes.from, 1);
    this.ccard[this.cardNdx].order.splice(indexes.to, 0, element);
  }

  deleteItem (item) {
    this.list.closeSlidingItems();    
    let ndx = this.ccard[this.cardNdx].order.indexOf(item);
    if (ndx !== -1)
      this.ccard[this.cardNdx].order.splice (ndx, 1);
    
  }

  ionViewWillEnter() {
    let cardName = this.navParams.get("name");
    this.isEdit = this.navParams.get("edit");
    console.log ("SETTINGS CALLED WITH "+ cardName);
   this.utils.getCallingCard()
    .then (ccards => {
      console.log ("Got calling card:" + JSON.stringify(ccards));
      if (ccards) {
        this.ccard = ccards;
        let i;
        for (i=0; i < this.ccard.length; i++) {
          if (this.ccard[i].name.toLowerCase() == cardName.toLowerCase()) break;
        }
        if (i < this.ccard.length) {
          this.cardNdx = i;
          console.log ("Found card at index " + this.cardNdx)
        }
      }


    })
  }

  ionViewWillLeave() {
    if (this.ccard[this.cardNdx].access) {
      console.log ("SAVING calling card details");
      this.utils.setCallingCard(this.ccard);
    }
    else {
      console.log ("Not saving details, no access #");
    }
    
  }

}
