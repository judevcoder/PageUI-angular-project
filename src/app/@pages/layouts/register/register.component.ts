import {Component, ComponentFactoryResolver, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef} from '@angular/core';
import {RootLayout} from '../root/root.component';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../auth/_services/authentication.service';
import { Helpers } from "../../helpers";
import { AlertService } from '../auth/_services/alert.service';
import { AlertComponent } from '../auth/_directives/alert.component';

@Component({
    selector: 'register-layout',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterLayout implements OnInit {
    registerForm: FormGroup;

    model: any = {};
    loading = false;
    returnUrl: string;

    @ViewChild('alertSignUp',
        { read: ViewContainerRef }) alertSignUp: ViewContainerRef;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _alertService: AlertService,
        private _authService: AuthenticationService,
        private cfr: ComponentFactoryResolver,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {}

    register() {
        this.validation();
        if (this.registerForm.controls.email.invalid) {
            this.showAlert('alertSignUp');
            this._alertService.error('Email is not valid');
            return;
        }

        this.loading = true;

        this._authService.signUp(this.model.email, this.model.password).subscribe(
            data => {
                this._router.navigate(['/dashboard']);
            },
            error => {
                this.showAlert('alertSignUp');
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

    validation() {
        this.registerForm = this.formBuilder.group({
            email: [this.model.email, [Validators.required, Validators.email]],
            password: [this.model.password, [Validators.required]]
        });
    }

}
