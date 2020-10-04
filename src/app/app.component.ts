import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //   const result = await Diagnostic.getPermissionAuthorizationStatus(
      //     Diagnostic.permission.READ_SMS
      //   );
      //   console.log(result);
      //   Diagnostic.requestRuntimePermission(Diagnostic.permission.READ_SMS).then(
      //     (data) => {
      //       console.log(`getCameraAuthorizationStatus`);
      //       console.log(data);
      //     }
      //   );

      //   this.androidPermissions
      //     .checkPermission(this.androidPermissions.PERMISSION.READ_SMS)
      //     .then(
      //       (result) => console.log('Has permission?', result.hasPermission),
      //       (err) => {
      //         this.androidPermissions.requestPermission(
      //           this.androidPermissions.PERMISSION.READ_SMS
      //         );
      //       }
      //     );

      //   this.androidPermissions.requestPermissions([
      //     this.androidPermissions.PERMISSION.CAMERA,
      //     this.androidPermissions.PERMISSION.GET_ACCOUNTS,
      //   ]);
    });
  }
}
