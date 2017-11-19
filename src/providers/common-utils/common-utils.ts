import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { Platform, ToastController } from 'ionic-angular';

declare var getLocalInfo: any; //chronomouse

// structure for dialing sequence
interface OrderType {
  name: string,
  value: number
};

// structure for favorite entry
export interface FavType {
  name: string,
  phone: string,
  type: string,
  card?: string,
  country?: string,
  icon?: string,
}

// structure for calling card list
export interface CallingCard {
  name: string,
  access: string,
  pin: string,
  order: OrderType[]
}

@Injectable()
export class CommonUtilsProvider {

  favList: FavType[] = [];
  recentList: FavType[] = [];
  callingCardList: CallingCard[] = [];

  isRecentLoaded: boolean = false;
  isFavLoaded: boolean = false;
  isCallingCardLoaded: boolean = false;


  constructor(public toastCtrl: ToastController, public storage: Storage, public call: CallNumber, public platform: Platform) {
    console.log('Hello CommonUtilsProvider Provider');
    // TBD: Handle case when this doesn't happen and updateFav is called
    this.getFavList().then(_ => { this.isFavLoaded = true; })
      .catch(_ => this.presentToast("Critical error loading Favorites", "error"));
    this.getRecentList().then(_ => { this.isRecentLoaded = true; })
      .catch(_ => this.presentToast("Critical error loading Recent Calls", "error"));
    this.getCallingCard().then(_ => { this.isCallingCardLoaded = true; })
      .catch(_ => this.presentToast("Critical error loading Calling Calls", "error"));

  }

  init() {
    return this.platform.ready()
      .then(_ => { return this.storage.ready() })
  }

  /**
   * displays a toast
   * 
   * @param {any} text 
   * @param {any} [type] 
   * @param {any} [dur] 
   * @memberof CommonUtilsProvider
   */
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
  /**
   * based on type of phone, returns icon for cell phone or regular phone
   * 
   * @param {any} str 
   * @returns 
   * @memberof CommonUtilsProvider
   */
  returnIcon(str) {
    console.log("icon match called with " + str);
    var re = /mob|cell/gi;
    return (str.search(re) != -1) ? 'phone-portrait' : 'call';
  }

  /**
   * returns saved fav list
   * 
   * @returns {Promise<FavType[]>} 
   * @memberof CommonUtilsProvider
   */
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

  /**
   * saves Recently dialed list
   * 
   * @param {FavType[]} recent 
   * @memberof CommonUtilsProvider
   */
  setRecentList(recent: FavType[]) {
    this.recentList = recent;
    this.platform.ready().then(() => {
      this.storage.ready().then(() => {
        this.storage.set('recent', recent)

      });
    });

  }

  /**
   * returns saved recently dialed list
   * 
   * @returns {Promise<FavType[]>} 
   * @memberof CommonUtilsProvider
   */
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

  /**
   * saves favorite list 
   *  
   * @param {FavType[]} fav 
   * @memberof CommonUtilsProvider
   */
  setFavList(fav: FavType[]) {
    this.favList = fav;
    this.platform.ready().then(() => {
      this.storage.ready().then(() => {
        this.storage.set('fav', fav)
      });
    });

  }

  /**
   * checks if an entry is already there in recent list
   * used to avoid duplicate entries
   * 
   * @param {FavType} item 
   * @returns 
   * @memberof CommonUtilsProvider
   */
  isPresentInRecent(item: FavType) {

    let i;
    for (i = 0; i < this.recentList.length; i++) {
      if (this.recentList[i].name == item.name &&
        this.recentList[i].phone == item.phone &&
        this.recentList[i].type == item.type)
        break;

    }
    return (i < this.recentList.length ? true : false)
  }

  /**
   * returns list of saved calling cards
   * 
   * @returns {Promise<CallingCard[]>} 
   * @memberof CommonUtilsProvider
   */
  getCallingCard(): Promise<CallingCard[]> {
    return this.platform.ready()
      .then(_ => { return this.storage.ready() })
      .then(_ => {
        return this.storage.get('callingCard')
      })
  }

  /**
   * saves calling card list
   * 
   * @param {CallingCard[]} card 
   * @returns {Promise <any>} 
   * @memberof CommonUtilsProvider
   */
  setCallingCard(card: CallingCard[]): Promise<any> {

    return this.platform.ready().then(() => {
      return this.storage.ready().then(() => {
        console.log("SAVING:" + JSON.stringify(card));
        return this.storage.set('callingCard', card)
      });
    });

  }

  /**
   * returns commas for each pause count
   * used for dial sequence
   * 
   * @param {any} count 
   * @returns {string} 
   * @memberof CommonUtilsProvider
   */
  pause(count): string {
    return ','.repeat(count);
  }

  /**
   * Uses https://github.com/zMeadz/chronomouse 
   * to convert a phone # to time and location
   * if possible
   * 
   * @param {any} phone 
   * @returns 
   * @memberof CommonUtilsProvider
   */
  getLocTz(phone) {
    let l = getLocalInfo(phone, {
      military: false,
      zone_display: 'area'
    });
    let result = '';
    if (l.time.display) result += l.time.display;
    if (l.time.display && l.location) result += " in ";
    if (l.location) result += l.location;
    return result;
  }


  /**
   * dials a # directly. Core function called by wrappers 
   * of other pages
   * 
   * @param {any} number 
   * @returns 
   * @memberof CommonUtilsProvider
   */
  directDial(number) {
    return this.call.callNumber(number, true);
  }

  /**
   * dials a # via the default calling card. Core function
   * called by wrappers of other pages
   * 
   * @param {any} number 
   * @returns {Promise <any>} 
   * @memberof CommonUtilsProvider
   */
  dial(number): Promise<any> {
    return this.getCallingCard()
      .then(cards => {
        let card = cards[0];
        if (!card) {
          console.log("No calling card configured");
          this.presentToast('Calling card not configured', 'error')
          return Promise.reject(false);
        }
        else {

          number = number.replace(/\D/g, '');
          let prefix = card.access;
          let pin = card.pin;

          let sequence = '';
          for (let i = 0; i < card.order.length; i++) {
            switch (card.order[i].name) {
              case 'number': sequence = sequence + number; break;
              case 'access': sequence = sequence + prefix; break;
              case 'pause': sequence = sequence + this.pause(card.order[i].value / 2); break;
              default: sequence = sequence + card.order[i].name; break;
            }
          }
          //let numtodial = prefix + this.pause(3) + pin + this.pause(3) + number;
          console.log("calling " + sequence);
          return this.call.callNumber(sequence, true)

        }
      })


  }

  /**
   * returns indes of fav entry inside a fav list
   * 
   * @param {FavType} fav 
   * @param {FavType[]} favs 
   * @returns {number} 
   * @memberof CommonUtilsProvider
   */
  favIndex(fav: FavType, favs: FavType[]): number {
    let ndx = -1;
    let i;
    //console.log("Searching for:" + JSON.stringify(fav));
    for (i = 0; i < favs.length; i++) {

      // console.log("Comparing to:" + JSON.stringify(favs[i]));
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


  /**
   * either adds or removes a fav entry
   * called when you 'star' or 'unstar' an entry
   * from either contact or fav page
   * 
   * @param {string} name 
   * @param {any} item 
   * @param {boolean} [remove=false] 
   * @memberof CommonUtilsProvider
   */
  updateFav(name: string, item, remove = false) {
    let u: FavType = {
      name: name,
      phone: item.phone,
      type: item.type,
      card: ''
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
