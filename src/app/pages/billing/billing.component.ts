import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {  FormBuilder, FormGroup } from '@angular/forms';
import * as $ from 'jquery';

@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BillingComponent implements OnInit {

	planForm: FormGroup;

	companyName = "Oracel XYZ";

	editableCompanyName: boolean = false;

	billingEmail = "john@oracle.com";

	editableBillingEmail: boolean = false;

	invoiceHistoryList = [
		{
			invoicenum: "00271785",
			date: "2019-04-05",
			status: "paid",
			amount: 49.00
		},
		{
			invoicenum: "00239415",
			date: "2019-03-05",
			status: "paid",
			amount: 49.00
		}
	]

    constructor (private formBuilder: FormBuilder) {}

    ngOnInit() {
    	this.planForm = this.formBuilder.group({
      		radio: 'C'
    	});
    }

    toggleButton(plan_type) {
    	if (plan_type == "month") {
    		$(".btn.annual").removeClass('btn-primary');
    		$(".btn.month").addClass('btn-primary');
    	} else {
    		$(".btn.month").removeClass('btn-primary');
    		$(".btn.annual").addClass('btn-primary');
    	}
    }

    editCompanyName() {
    	this.editableCompanyName = true;
    }

    saveCompanyName() {
    	this.editableCompanyName = false;
    }

    editBillingEmail() {
    	this.editableBillingEmail = true;
    }

    saveBillingEmail() {
    	this.editableBillingEmail = false;
    }
}