import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import { Platform } from 'ionic-angular';

@Injectable()
export class CommonUtilsProvider {

  favList = [];
  recentList = [];

  constructor(public storage:Storage, public call:CallNumber, public platform:Platform) {
    console.log('Hello CommonUtilsProvider Provider');
  }

  init() {
    return this.platform.ready()
    .then (_=> {return this.storage.ready()})
  }

  returnIcon(str) {
    console.log("icon match called with " + str);
    var re = /mob|cell/gi;
    return (str.search(re) != -1) ? 'phone-portrait' : 'call';
  }

  
  getFavList(): Promise<any> {
    return this.platform.ready()
    .then ( _=> {return this.storage.ready()})
    .then (_ => {
      return this.storage.get('fav')
      .then (favs => { 
            console.log ("GOT FAVLIST="+JSON.stringify(favs));
            if (favs) this.favList = favs
            return favs; //same as below
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#Chaining
            
            //return Promise.resolve(favs);
          });

    })
    
        
  }

  setFavList(fav) {
    this.favList = fav;
    this.platform.ready().then(() => {
      this.storage.ready().then (() => {
        this.storage.set ('fav', fav)
  
        });

      });

  }


  pause(count): string {
    return ','.repeat(count);
  }



  dial(number) {
    number = number.replace(/\D/g, '');
    let prefix = '18664947291';
    let pin = '2110#';
    let numtodial = prefix + this.pause(3) + pin + this.pause(3) + number;
    console.log("calling " + numtodial);
    this.call.callNumber(numtodial, true)
  }



  updateFav (name, item, remove = false ) {

    let u = {
      name:name,
      phone:item.value,
      type:item.type
    }
    let ndx = this.favList.indexOf(u);
    if (!remove) { // add 

      if (ndx == -1) { // new item
        this.favList.push(u)
      } 
      else
        this.favList[ndx] = u; // replace
      
    }
    else { //remove
      let ndx = this.favList.indexOf(u);
      if (ndx ! -1) {
          this.favList.splice(ndx,1);
      }

    }
    console.log ( "SAVED FAB LIST="+JSON.stringify(this.favList));
    this.storage.set ('fav', this.favList);

  }


  
}
