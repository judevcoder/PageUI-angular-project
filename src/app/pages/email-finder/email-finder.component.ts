import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';

@Component({
  selector: 'app-email-finder',
  templateUrl: './email-finder.component.html',
  styleUrls: ['./email-finder.component.scss']
})
export class EmailFinderComponent implements OnInit {
  	fileName: string = null;

  	@ViewChild('mdSlideUp') mdSlideUp: ModalDirective;

  	constructor (
  		private formBuilder: FormBuilder

  		) {
  	}

  	ngOnInit() {
  	}

  	public drapDrop() {
  		this.mdSlideUp.show();
  	}

}
