import { Component } from '@angular/core';
import { FavPage } from '../fav/fav';
import { ContactPage } from '../contact/contact';
import { CardListPage } from '../card-list/card-list';
import { Storage } from '@ionic/storage';



@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  tab1Root = ContactPage;
  tab2Root = FavPage;
  tab3Root = CardListPage;

  constructor(public storage:Storage) {
    storage.ready().then ( () => {
      console.log("Storage engine is:" + storage.driver);
    })
  }

}
