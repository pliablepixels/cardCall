import { Component, ViewChild,trigger,state,style,transition,animate } from '@angular/core';
import { List, NavController, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { FavType, CommonUtilsProvider } from '../../providers/common-utils/common-utils';
import { Events } from 'ionic-angular';
import {CardAnimation} from '../../animations/animations'


@Component({
  selector: 'page-fav',
  templateUrl: 'fav.html',
 
  animations: [
    CardAnimation
  ]
    
  
})
export class FavPage {

  @ViewChild(List) list: List; // needed to close sliding list

  favList: FavType[] = [];
  recentList:FavType[] = [];
  cardInUse="(none)";
  cardState = 'hide';
  constructor(public navCtrl: NavController, public utils: CommonUtilsProvider, public events: Events, public alertCtrl: AlertController) {

  }

  // remove all favorites
  removeAllFav() {
    const alert = this.alertCtrl.create({
      title: 'Please Confirm',
      message: 'Delete all favorites?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.favList.length = 0;
            this.utils.setFavList(this.favList);
            this.events.publish("fav:updated", { name: "", phone: "" });

          }
        }
      ]
    }).present();


  }

  // remove a specific favorite
  removeFav(fav: FavType) {
    let ndx = this.favList.indexOf(fav);
    if (ndx !== -1) {
      this.favList.splice(ndx, 1);
      this.utils.setFavList(this.favList);

    }
    this.list.closeSlidingItems();
    this.events.publish("fav:updated", { name: fav.name, phone: fav.phone });


  }



  pause(count): string {
    return ','.repeat(count);
  }

  dial(fav) {
    console.log("FAV DIAL " + JSON.stringify(fav))
    this.utils.dial(fav.phone)
    .then (_ => {
      if (!this.utils.isPresentInRecent(fav)) {
        // add to top of recent call list if not already there
        this.recentList.unshift(fav);
        this.utils.setRecentList (this.recentList);
      } 
    })
    .catch (_ => {console.log ("Not called")})

  }

  ionViewWillEnter() {
    this.cardState = 'hide';
    setTimeout (_ => {this.cardState = 'reveal';},20);
    this.cardInUse="(none)";
    this.utils.getFavList()
      .then(favs => {
        if (favs) this.favList = favs;
        //this.favList.length = 0;
        /*
        this.favList.push ({name:"test1", phone:"1",type:"mob"});
        this.favList.push ({name:"test2", phone:"1",type:"mob"});
        this.favList.push ({name:"test3", phone:"1",type:"mob"});
        this.favList.push ({name:"test4", phone:"1",type:"mob"});*/

        return this.utils.getCallingCard();
      })
      .then (cards => {
        this.cardInUse = (cards && cards.length) ? cards[0].name: 'none';
        return this.utils.getRecentList();
      })
      .then ( recents => {
        if (recents) this.recentList = recents;
      });

  }

}