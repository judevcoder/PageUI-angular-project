import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';

@Component({
    selector: 'app-integrations',
    templateUrl: './integrations.component.html',
    styleUrls: ['./integrations.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IntegrationsComponent implements OnInit {

	integrationItems = [
		{
			title: "Salesforce",
			image: "assets/img/salesforce-logo.png",
			description: "Create leads and send conversations to Salesforce"
		},
		{
			title: "Pipedriver",
			image: "assets/img/pipedriver.png",
			description: "Create leads and send conversations to Pipedrive"
		},
		{
			title: "Hubspot",
			image: "assets/img/Hubspotlogo.png",
			description: "Automatically leads and send conversations to Hubspot"
		}
	]

	item: object = {
		title: null,
		image: null,
		description: null
	}

	@ViewChild('mdSlideUp') mdSlideUp: ModalDirective;

    constructor () {}

    ngOnInit() {
    }

    integrationProcess(item) {
    	this.item = item;
    	this.mdSlideUp.show();

    }

}