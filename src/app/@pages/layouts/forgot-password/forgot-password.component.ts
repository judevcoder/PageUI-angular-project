import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RootLayout} from '../root/root.component';

@Component({
    selector: 'forgot-password-layout',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordLayout extends RootLayout implements OnInit {

  ngOnInit() {
  }

}