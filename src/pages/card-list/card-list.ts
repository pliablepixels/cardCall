import { Component, ViewChild,trigger,state,style,transition,animate } from '@angular/core';
import { List, IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
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
  animations: [
    trigger('inputAnim', [
      state('reveal', style({transform: 'scale(1.0)'})),
      transition('void => reveal', [
        style({backgroundColor:'rgba(46, 204, 113,0.5)', transform: 'scale(1.3)'}),
        animate('500ms ease-in-out')
      ])
    ]),

]
  
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public utils:CommonUtilsProvider, public alertCtrl:AlertController) {
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
       console.log ("INSIDE CARD LIST: Got calling card:" + JSON.stringify(ccards));
       if (ccards) this.ccards = ccards;
     })
   }
}
