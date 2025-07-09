import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import {
  ToastController,
  Platform,
  LoadingController
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  ILatLng,
  BaseArrayClass,
  LatLng,
  MarkerOptions
} from '@ionic-native/google-maps';
import { ModuleService } from 'src/app/shared/services/module.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
declare var google;
@Component({
  selector: 'app-viewmapmodal',
  templateUrl: './viewmapmodal.page.html',
  styleUrls: ['./viewmapmodal.page.scss'],
})
export class ViewmapmodalPage implements OnInit {
  dismissed: boolean;
  map: GoogleMap;
  GetClickedLocation:any = '';
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  //@Input() map_canvas: string;
  @Input() latlong: any;
 // @ViewChild('map_canvas_view', { static: false }) mapElement: ElementRef
  @ViewChild('map_canvas_view') element: ElementRef;
  //map_canvas_view: GoogleMap;
  constructor(public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private modalController: ModalController,
    private moduleService: ModuleService,
    private androidPermissions: AndroidPermissions,
    public geolocation:Geolocation,private locationAccuracy: LocationAccuracy,
    public navParams: NavParams,private navCtrl: NavController
    ) { }

  ngOnInit(){
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   this.modalController.dismiss();
    // });
  }

  
  closeModalBt(close:any) {
    this.modalController.dismiss();
  }

  ionViewDidEnter() {
    console.log("call ionViewDidLoad");
    this.platform.ready().then(() => {
      this.initMap(this.navParams.get('latlong'));
    });
  }


  initMap(latlong:any) {
    let latitude = latlong.split(',')[0];
    let longitude = latlong.split(',')[1];
    this.map = GoogleMaps.create(this.element.nativeElement);

    this.map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
      let coordinates: LatLng = new LatLng(latitude, longitude);
      let position = {
        target: coordinates,
        zoom: 17
      };
    this.map.animateCamera(position);
      let markerOptions: MarkerOptions = {
        position: coordinates,
        //icon: "../../assets/images/icons8-Marker-64.png",
        //title: 'Greensboro, NC'
      };
      const marker = this.map.addMarker(markerOptions)
        .then((marker: Marker) => {
          marker.showInfoWindow();
        });
    })
  }

  

  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.enableGPS();
        } else {
          this.locationAccPermission();
        }
      },
      error => {
        //alert(error);
        //this.toastService.showError(error, 'Alert');
      }
    );
  }

  locationAccPermission() {
    
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      //this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION="adadasdjasgdjsagdj";
      if (canRequest) {
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              this.enableGPS();
            },
            error => {
              //alert(error)
              //this.toastService.showError(error, 'Alert');
            }
          );
      }
    });
  }

  enableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        localStorage.setItem("locationserviceenabled","true");
        // this.map.clear();
        // this.map.remove();
        // this.loadMap();
      },
      error => localStorage.setItem("locationserviceenabled","false")//this.toastService.showError(error, 'Alert')//alert(JSON.stringify(error))
    );
  }

 

  async onButtonClick() {
    //this.map.clear();
    let latlong = this.navParams.get('latlong')
    let latitude = latlong.split(',')[0];
    let longitude = latlong.split(',')[1];
    this.map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {
      let coordinates: LatLng = new LatLng(latitude, longitude);
      let position = {
        target: coordinates,
        zoom: 17
      };
    this.map.animateCamera(position);
      let markerOptions: MarkerOptions = {
        position: coordinates,
        //icon: "../../assets/images/icons8-Marker-64.png",
        //title: 'Greensboro, NC'
      };
      const marker = this.map.addMarker(markerOptions)
        .then((marker: Marker) => {
          marker.showInfoWindow();
        });
    })
    // Get the location of you
    // this.map.getMyLocation().then((location: MyLocation) => {
    //   console.log(JSON.stringify(location, null, 2));
    //   this.moduleService.mapEvent.next(location.latLng);
    //   localStorage.setItem("LocationVal", location.latLng.lat+","+location.latLng.lng)
    //   // Move the map camera to the location with animation
    //   this.map.animateCamera({
    //     target: location.latLng,
    //     zoom: 17,
    //     tilt: 30
    //   });


    //   // add a marker
    //   const marker= this.map.addMarker({
    //     // title: 'RP Web Apps',
    //     // snippet: 'It Service',
    //     position: location.latLng,
    //     animation: GoogleMapsAnimation.BOUNCE,
    //     //draggable:true,
        
    //   })

    //   // show the infoWindow
    //   //marker.showInfoWindow();

    //   // If clicked it, display the alert
    //   //marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((data:any) => {

    //     //console.log(data);
    //     //this.showToast('clicked!');
    //   // });
    // })
    //   .catch(err => {

    //     //this.showToast(err.error_message);
    //   });
  }

  ionViewWillLeave() {

    this.modalController.dismiss();
    const mapElement = this.element.nativeElement;
    mapElement.parentNode.removeChild(mapElement);
    const nodeList = document.querySelectorAll('._gmaps_cdv_');

    for (let k = 0; k < nodeList.length; ++k) {
        nodeList.item(k).classList.remove('_gmaps_cdv_');
    }
    console.log('ionViewWillLeave'); 
    //this.navCtrl.pop();
    //this.navCtrl.navigateRoot('/transactionslist');
}
}
