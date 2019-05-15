import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Quill from 'quill';
import * as $ from 'jquery';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {

	profileName = "Gary Egan";
	jobTitle;
	twitterLink;
	linkedinLink;
	url = null;

	disabled = true;

	@ViewChild('mdSlideUp') mdSlideUp: ModalDirective;

    constructor () {}

    ngOnInit() {

    }

    readUrl(event:any) {
  		if (event.target.files && event.target.files[0]) {
	    	var reader = new FileReader();

	    	reader.onload = (event: ProgressEvent) => {
	      		this.url = (<FileReader>event.target).result;
	    	}

	    	reader.readAsDataURL(event.target.files[0]);
  		}
	}

	uploadImage() {
		$('#upload_image').click();
	}

	changePassword() {
		this.mdSlideUp.show();
	}

	saveNewPassword() {
		setTimeout(() => {
			this.mdSlideUp.hide();
		}, 500);
	}

	cancelPasswordChange() {
		this.mdSlideUp.hide();
	}

	updateProfileData() {
		if (this.disabled) {
			this.disabled = false;	
		} else this.disabled = true;
	}

}