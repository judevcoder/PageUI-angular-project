import {Component, OnInit, ViewEncapsulation, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import {RootLayout} from '../root/root.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertComponent } from './_directives/alert.component';
import { AlertService, AuthenticationService } from './_services/index';

@Component({
    selector: 'auth-login-layout',
    templateUrl: './auth-login.component.html',
    styleUrls: ['./auth-login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AuthLoginLayout implements OnInit {
    loginForm: FormGroup;

	model: any = {};
    loading = false;
    returnUrl: string;

    @ViewChild('alertSignin',
        { read: ViewContainerRef }) alertSignin: ViewContainerRef;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver,
        private formBuilder: FormBuilder
    ) { 

    }

  	ngOnInit() {
  		// reset login status
  		this.model.remember = true;
        this._authService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  	}

  	login() {
        this.validation();
        if (this.loginForm.controls.email.invalid) {
            this.showAlert('alertSignin');
            this._alertService.error('Email is not valid');
            return;
        }
        this.loading = true;
        this._authService.login(this.model.email, this.model.password)
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                	this.showAlert('alertSignin');
                    this._alertService.error(error);
                    this.loading = false;
                });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    inputCred() {
    	this['alertSignin'].clear();
    }

    validation() {
        this.loginForm = this.formBuilder.group({
            email: [this.model.email, [Validators.required, Validators.email]],
            password: [this.model.password, [Validators.required]]
        });
    }

}
