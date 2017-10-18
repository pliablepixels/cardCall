import { Component, ViewChild } from '@angular/core';

import { List, IonicPage, NavController, AlertController, Platform } from 'ionic-angular';
import { Contacts, Contact } from '@ionic-native/contacts';
import { parse, format, asYouType } from 'libphonenumber-js';
import {CommonUtilsProvider} from '../../providers/common-utils/common-utils';
import { Events } from 'ionic-angular';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ContactPage {
  @ViewChild(List) list: List; // needed to close sliding list
  contact = {
    displayName: "",
    id: "",
    phoneNumbers: []
  }

  favList = []; // {name, number}
  private _subHandler: (data:any) => void;



   constructor(public navCtrl: NavController, public contacts: Contacts, public platform: Platform, public utils:CommonUtilsProvider, public events:Events) {

    this._subHandler = (data) => {this.favChangedNotification(data)};
    this.events.subscribe('fav:updated', this._subHandler); 
  }

  favChangedNotification(obj) {
    
      console.log ("Got Fab Changed Notif in Contacts " + JSON.stringify(obj));
      if (obj.name != this.contact.displayName) return;

      for (let i=0; i < this.contact.phoneNumbers.length; i++) {
          if (this.contact.phoneNumbers[i].value == obj.phone) {
            this.contact.phoneNumbers[i].icon = this.utils.returnIcon(
              this.contact.phoneNumbers[i].type);
          }
      }
      

  }

  toggleFav (item) {
    if (item.icon == 'star') { // remove fav
      this.utils.updateFav(this.contact.displayName, item, true);
      setTimeout ( _ => {item.icon = this.utils.returnIcon(item.type);},300);
    }
    else { // make fav
      this.utils.updateFav(this.contact.displayName, item, false);
      setTimeout ( _ => {item.icon = 'star'},300);
    }
    this.list.closeSlidingItems();
    
  }
  processContact(c): any {
    this.contact = {
      displayName: "",
      id: "",
      phoneNumbers: []
    }
    this.contact.displayName = c.displayName || c.name.formatted;
    this.contact.id = c.id;
    let p = c.phoneNumbers;

    for (let i = 0; i < p.length; i++) {
      if (p[i].type.toLowerCase().indexOf('fax') != -1) continue;
      console.log("parsing " + p[i].value);
      let parsed = parse(p[i].value, { country: { default: 'US' } });
      let pp = p[i].value;
      if (parsed.phone) {
        pp = format({ country: parsed.country, phone: parsed.phone }, 'International')
      }

      let pc = parsed.country || '';
      this.contact.phoneNumbers.push({
        icon: this.utils.returnIcon(p[i].type),
        value: p[i].value,
        country: pc,
        type: p[i].type
      })
      console.log("PUSHED:" + JSON.stringify(pc));
    }
  }

  dial (number) {
    this.utils.dial(number);
  }
  

  pickContact() {
    this.platform.ready().then(() => {
      this.contacts.pickContact()
        .then(c => {
          this.processContact(c);
          console.log("PICKED " + JSON.stringify(this.contact))

        })

    })
  }
  ionViewWillEnter() {
    this.utils.getFavList()
    .then ( fav => {if (fav) this.favList = fav;})
    if (!this.contact.displayName)
      this.pickContact();
      

      

  }


  ionViewWillUnload() {
    console.log ("Killing fav subscription");
    this.events.unsubscribe('fab:updated', this._subHandler);
    this._subHandler = undefined;
  }


}
