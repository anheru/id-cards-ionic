import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonDatetime, ToastController } from '@ionic/angular';
import { DataService } from '@shared/services/data.service';
import { LocationService } from '../shared/services/location.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild('datetime') datetime!: IonDatetime;
  ionicForm: FormGroup;
  today: string;
  currentCountry = 'US';
  states: string[] = [];
  cities: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private toastController: ToastController,
    private locationService: LocationService,
  ) {
    this.today = new Date().toISOString().substring(0, 10)
    this.ionicForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      dob: ['', [Validators.required]],
      job: '',
      state: '',
      city: '',
      street: '',
      picture: '',
      phone: ['', [Validators.pattern('^[0-9]+$')]]
    })
  }

  ngOnInit() {
    this.states = this.locationService.getStatesByCountry(this.currentCountry);

    console.log("this.ionicForm.get('state')", this.ionicForm.get('state')?.valueChanges)
    this.ionicForm.get('state')?.valueChanges.subscribe((state) => {
      this.ionicForm.get('city')?.reset();
      this.ionicForm.get('city')?.disable();
      console.log('state', state)
      if (state) {
        this.cities = this.locationService.getCitiesByState(this.currentCountry, state);
        this.ionicForm.get('city')?.enable();
      }
    });
  }

  getDate(e: any) {
    if (!e.target.value) { return; }
    const date = new Date(e.target.value).toISOString().substring(0, 10);
    this.ionicForm.get('dob')?.setValue(date, {
      onlyself: true
    })
  }

  loadImageFromDevice(e: any) {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = () => {
      this.ionicForm.get('picture')?.setValue(reader.result, {
        onlyself: true
      })
      e.target.value = '';
    }
  }

  submitForm() {
    if (this.ionicForm.invalid) {
      this.presentToast('danger')
      return;
    }

    this.dataService.create(this.ionicForm.getRawValue())
    this.ionicForm.reset()
    this.datetime.reset()
    this.presentToast('success')
  }

  async presentToast(type: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: type === 'success' ? 'Profile created' : 'No profiles saved',
      duration: 1500,
      icon: type === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline',
      position: 'top',
      color: type
    });

    await toast.present();
  }
}
