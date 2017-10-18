import { Component, ViewChild } from '@angular/core';
import { List, NavController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { CommonUtilsProvider } from '../../providers/common-utils/common-utils';
import { Events } from 'ionic-angular';


@Component({
  selector: 'page-fav',
  templateUrl: 'fav.html'
})
export class FavPage {

  @ViewChild(List) list: List; // needed to close sliding list

  favList = []; // {name, number}

  constructor(public navCtrl: NavController, public utils: CommonUtilsProvider, public events: Events) {

  }



  deleteFavs() {
    this.favList = [];
    this.utils.setFavList([]);
    this.events.publish("fav:updated", { name: "", phone: "" });
  }

  removeFav(fav) {
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

  dial(number) {
    this.utils.dial(number);
  }

  ionViewWillEnter() {
    this.utils.getFavList()
      .then(favs => {
        if (favs) this.favList = favs;
        // console.log ("RECEIVED="+JSON.stringify(favs));
        // console.log ("STUFFED="+JSON.stringify(this.favList));

      });
  }

}