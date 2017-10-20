import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { FavPage } from '../pages/fav/fav';
import { ContactPage } from '../pages/contact/contact';
import { SettingPage } from '../pages/setting/setting';
import { TabsPage } from '../pages/tabs/tabs';
import { CardListPage } from '../pages/card-list/card-list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Contacts } from '@ionic-native/contacts';
import { CallNumber } from '@ionic-native/call-number';
import { IonicStorageModule } from '@ionic/storage';
import { CommonUtilsProvider } from '../providers/common-utils/common-utils';



@NgModule({
  declarations: [
    MyApp,
    FavPage,
    ContactPage,
    SettingPage,
    TabsPage,
    CardListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({name:'__cardCallDB', driverOrder:['sqlite','websql','indexeddb']})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FavPage,
    ContactPage,
    SettingPage,
    TabsPage,
    CardListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Contacts,
    CallNumber,

    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonUtilsProvider
  ]
})
export class AppModule {}
