import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { Platform, ToastController } from 'ionic-angular';


export interface FavType {
  name:string,
  phone:string,
  type:string,
  card?:string,
  country?:string,
  icon?:string,
}

export interface CallingCard {
  name:string,
  access:string,
  pin:string
}

@Injectable()
export class CommonUtilsProvider {

  favList:FavType[] = [];
  recentList:FavType[] = [];


  
  constructor(public toastCtrl: ToastController, public storage: Storage, public call: CallNumber, public platform: Platform) {
    console.log('Hello CommonUtilsProvider Provider');
    // TBD: Handle case when this doesn't happen and updateFav is called
    this.getFavList();
  }

  init() {
    return this.platform.ready()
      .then(_ => { return this.storage.ready() })
  }

  presentToast(text, type?, dur?) {
    
        var cssClass = 'successToast';
        if (type == 'error') cssClass = 'errorToast';
    
        let toast = this.toastCtrl.create({
          message: text,
          duration: dur || 2500,
          position: 'top',
          cssClass: cssClass
        });
        toast.present();
      }

  returnIcon(str) {
    console.log("icon match called with " + str);
    var re = /mob|cell/gi;
    return (str.search(re) != -1) ? 'phone-portrait' : 'call';
  }

  getFavList(): Promise<FavType[]> {
    return this.platform.ready()
      .then(_ => { return this.storage.ready() })
      .then(_ => {
        return this.storage.get('fav')
          .then(favs => {
            if (favs) this.favList = favs
            return favs; 
          });

      })
  }

  setRecentList(recent:FavType[]) {
    this.recentList = recent;
    this.platform.ready().then(() => {
      this.storage.ready().then(() => {
        this.storage.set('recent', recent)
      });
    });

  }

  getRecentList(): Promise<FavType[]> {
    return this.platform.ready()
      .then(_ => { return this.storage.ready() })
      .then(_ => {
        return this.storage.get('recent')
          .then(recents => {
            if (recents) this.recentList = recents
            return recents; 
          });

      })
  }

  setFavList(fav:FavType[]) {
    this.favList = fav;
    this.platform.ready().then(() => {
      this.storage.ready().then(() => {
        this.storage.set('fav', fav)
      });
    });

  }


  getCallingCard(): Promise<CallingCard> {
    return this.platform.ready()
      .then(_ => { return this.storage.ready() })
      .then(_ => {
        return this.storage.get('callingCard')
      })
  }

  setCallingCard(card:CallingCard) {
   
    this.platform.ready().then(() => {
      this.storage.ready().then(() => {
        this.storage.set('callingCard', card)
      });
    });

  }



  pause(count): string {
    return ','.repeat(count);
  }


  dial(number): Promise <any> {
    return this.getCallingCard()
    .then (card => {
      if (!card) {
        console.log ("No calling card configured");
        this.presentToast('Calling card not configured', 'error')
        return Promise.reject(false);
      }
      else {

        number = number.replace(/\D/g, '');
        let prefix = card.access;
        let pin = card.pin;
        let numtodial = prefix + this.pause(3) + pin + this.pause(3) + number;
        console.log("calling " + numtodial);
        return this.call.callNumber(numtodial, true)

      }
    })

    
  }

  favIndex(fav:FavType, favs:FavType[]): number {
    let ndx = -1;
    let i;
    console.log("Searching for:" + JSON.stringify(fav));
    for (i = 0; i < favs.length; i++) {

      console.log("Comparing to:" + JSON.stringify(favs[i]));
      if (favs[i].name == fav.name &&
        favs[i].phone == fav.phone &&
        favs[i].type == fav.type) {
        //  console.log ("FOUND at "+i)
        break;
      }
    }
    if (i < favs.length) ndx = i;
    return ndx;
  }



  updateFav(name:string, item, remove = false) {
    let u:FavType = {
      name: name,
      phone: item.phone,
      type: item.type,
      card:''
    }
    let ndx = this.favIndex(u, this.favList);
    if (!remove) { // add 

      if (ndx == -1) { // new item
        this.favList.push(u)
      }
      else
        this.favList[ndx] = u; // replace

    }
    else { //remove
      let ndx = this.favIndex(u, this.favList);
      if (ndx != -1) {
        this.favList.splice(ndx, 1);
      }

    }
    console.log("SAVED FAB LIST");
    this.storage.set('fav', this.favList);

  }

}
