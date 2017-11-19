import { Component, ViewChild,trigger,state,style,transition,animate } from '@angular/core';
import { List, IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {SettingPage} from '../setting/setting';
import { CommonUtilsProvider, CallingCard } from '../../providers/common-utils/common-utils';
import {InputAnimation} from '../../animations/animations'

@Component({
  selector: 'page-card-list',
  templateUrl: 'card-list.html',
  animations: [
    InputAnimation
]
  
})

export class CardListPage {

  @ViewChild(List) list: List;
  ccards:CallingCard[] = [];
  displayAddCard:boolean = false;
  newCardName:string = "";

  /**
   * edit details for a specific card name
   * if edit is true, then it starts in RW mode
   * else in RO mode to protect from inadvertent changes
   * edit is set to true only when a new card is created
   * 
   * @param {any} name 
   * @param {any} edit 
   * @memberof CardListPage
   */
  go(name, edit) {
    // make sure transition happens after we write to DB
    this.utils.setCallingCard(this.ccards)
    .then (_=> {this.navCtrl.push(SettingPage, {name:name, edit:edit});})
    
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public utils:CommonUtilsProvider, public alertCtrl:AlertController) {
  }

  /**
   * Sets a default card
   * The default card is always the first card
   * 
   * @param {any} card 
   * @memberof CardListPage
   */
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
/**
 * saves new card if valid
 * and removes the input
 * 
 * @returns 
 * @memberof CardListPage
 */
hideAndSaveCard() {
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

  /**
   * toggles display of card
   * 
   * @memberof CardListPage
   */
  addCard() {
    this.newCardName = "";
    this.displayAddCard = !this.displayAddCard;

  }
/**
 * removes a card after a prompt
 * 
 * @param {any} card 
 * @memberof CardListPage
 */
removeCard(card) {

    const alert = this.alertCtrl.create({
      title: 'Please Confirm',
      message: `Delete ${card.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.list.closeSlidingItems();
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.list.closeSlidingItems();
            let ndx = this.ccards.indexOf(card);
            if (ndx != -1) {
              this.ccards.splice(ndx,1);
                this.utils.setCallingCard(this.ccards);
              
            }
           
          }
        }
      ]
    }).present();


    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardListPage');
  }
  
  ionViewDidEnter() {
    this.utils.getCallingCard()
     .then (ccards => {
       //console.log ("INSIDE CARD LIST: Got calling card:" + JSON.stringify(ccards));
       if (ccards) this.ccards = ccards;
     })
   }
}
