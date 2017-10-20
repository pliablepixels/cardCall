import { Component, ViewChild } from '@angular/core';
import { List, IonicPage, NavController, NavParams } from 'ionic-angular';
import {SettingPage} from '../setting/setting';
import { CommonUtilsProvider, CallingCard } from '../../providers/common-utils/common-utils';

/**
 * Generated class for the CardListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */




@Component({
  selector: 'page-card-list',
  templateUrl: 'card-list.html',
})


export class CardListPage {

  @ViewChild(List) list: List;
  ccards:CallingCard[] = [];
  displayAddCard:boolean = false;
  newCardName:string = "";

  go(name, edit) {
    // make sure transition happens after we write to DB
    this.utils.setCallingCard(this.ccards)
    .then (_=> {this.navCtrl.push(SettingPage, {name:name, edit:edit});})
    
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public utils:CommonUtilsProvider) {
  }

  setDefault(card) {
    // bit of a hack - moves it to the top. Will change later
    this.list.closeSlidingItems();
    let ndx = this.ccards.indexOf(card);
    if (ndx != -1) {
      this.ccards.splice (ndx,1);
      this.ccards.unshift(card);
      this.utils.setCallingCard(this.ccards);
    }

    

  }

  hideAddCard() {
    this.displayAddCard = false;
    let i;
    for (i=0; i < this.ccards.length; i++) {
      if (this.ccards[i].name.toLowerCase() == this.newCardName) break;
    }
    if (i < this.ccards.length) {
      this.utils.presentToast("Card name already exists", "error");
      return;
    }
    else {
      this.ccards.push ({name:this.newCardName, access:"",pin:"", order:[]});
      this.go(this.newCardName, true);
    }
  }

  addCard() {
    this.newCardName = "";
    this.displayAddCard = !this.displayAddCard;

  }

  removeCard(card) {
    let ndx = this.ccards.indexOf(card);
    if (ndx != -1) {
      this.ccards.splice(ndx,1);
      this.utils.setCallingCard(this.ccards);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardListPage');
  }
  
  ionViewDidEnter() {
    this.utils.getCallingCard()
     .then (ccards => {
       console.log ("INSIDE CARD LIST: Got calling card:" + JSON.stringify(ccards));
       if (ccards) this.ccards = ccards;
     })
   }
}
