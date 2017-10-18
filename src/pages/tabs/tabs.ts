import { Component } from '@angular/core';
import { FavPage } from '../fav/fav';
import { ContactPage } from '../contact/contact';
import { SettingPage } from '../setting/setting';
import { Storage } from '@ionic/storage';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ContactPage;
  tab2Root = FavPage;
  tab3Root = SettingPage;



  constructor(public storage:Storage) {
    storage.ready().then ( () => {
      console.log("Storage engine is:" + storage.driver);
    })
  }
}
