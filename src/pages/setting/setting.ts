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
    this.list.closeSlidingItems();  
    this.isEdit = !this.isEdit;
       
  }

  // modify # of seconds of pause
  changePause(item, byVal) {
    item.value = item.value + byVal;
    if (item.value < 1) item.value = 1;
    if (item.value > 10) item.value = 10;
  }

  // inserts the right code in the order list 
  addSequence(code) {
    if (!this.isEdit) return;
    console.log ("ccard="+JSON.stringify(this.ccard))
    if (code=='access') {
      code = this.ccard[0].access;
      if (!code) {
        this.utils.presentToast("No access number entered", "error");
        return;
      }
    } 
    if (code == 'pin') {
      code = this.ccard[0].pin;
      if (!code) {
        this.utils.presentToast("No PIN number entered", "error");
        return;
      }
    } 
    let value=0;
    if (code=='pause') value=1;

    this.ccard[0].order.push ({name:code, value:value});
  }

  reorderItems(indexes) {
    let element = this.ccard[0].order[indexes.from];
    this.ccard[0].order.splice(indexes.from, 1);
    this.ccard[0].order.splice(indexes.to, 0, element);
  }

  deleteItem (item) {
    this.list.closeSlidingItems();    
    let ndx = this.ccard[0].order.indexOf(item);
    if (ndx !== -1)
      this.ccard[0].order.splice (ndx, 1);
    
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
    if (this.ccard[0].access) {
      console.log ("SAVING calling card details");
      this.utils.setCallingCard(this.ccard);
    }
    else {
      console.log ("Not saving details, no access #");
    }
    
  }

}
