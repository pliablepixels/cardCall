import { Component, ViewChild } from '@angular/core';
import { List, NavController, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { FavType, CommonUtilsProvider } from '../../providers/common-utils/common-utils';
import { Events } from 'ionic-angular';


@Component({
  selector: 'page-fav',
  templateUrl: 'fav.html'
})
export class FavPage {

  @ViewChild(List) list: List; // needed to close sliding list

  favList:FavType[] = []; 

  constructor(public navCtrl: NavController, public utils: CommonUtilsProvider, public events: Events, public alertCtrl:AlertController) {

  }

  removeAllFav() {

    const alert = this.alertCtrl.create({
      title: 'Please Confirm',
      message: 'Delete all items?',
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

  removeFav(fav:FavType) {
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
    this.utils.dial(fav.phone);
  }

  ionViewWillEnter() {
    this.utils.getFavList()
      .then(favs => {
        if (favs) this.favList = favs;
      });
      
  }

}