import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Quill from 'quill';
import * as $ from 'jquery';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {

	tagNames = ['CSV', 'Internal Users', 'Startup Annual Plan'];

    checkboxOptions = [
        {id: 'sb_open_email_night', label: 'When somebody opens my email in the night.'},
        {id: 'sb_open_email_night_go_sleep', label: 'When somebody opens my email in the night and then he goes to sleep.'},
        {id: 'sb_click_email_night', label: 'When somebody clicks my email in the night.'},
        {id: 'sb_click_email_night_go_sleep', label: 'When somebody clicks my email in the night and goes to sleep.'},
        {id: 'sb_click_email_night_go_sleep_1', label: 'When somebody clicks my email in the night and goes to sleep.'},
        {id: 'sb_click_email_night_go_sleep_2', label: 'When somebody clicks my email in the night and goes to sleep.'},
        {id: 'sb_click_email_night_go_sleep_3', label: 'When somebody clicks my email in the night and goes to sleep.'},
        {id: 'sb_click_email_night_go_sleep_4', label: 'When somebody clicks my email in the night and goes to sleep.'},
        {id: 'sb_click_email_night_go_sleep_5', label: 'When somebody clicks my email in the night and goes to sleep.'}
    ]

	unsubscribe = true;

    constructor () {}

    ngOnInit() {

    }

    checkNotification() {
    	if($("div.checkbox.check-success input:checked").length > 0){
   			this.unsubscribe = false;
    	} else {
    		this.unsubscribe = true;
    	}

    }

    toogleUnsubscribe() {
    	let checkboxList = $("div.checkbox.check-success input");
    	if ($("span.toggle-switch").hasClass("toggle-switch-checked")) {
    		$("div.checkbox.check-success input").prop('checked', 1);
    		this.checkNotification();
    	}
    	else
    		$("div.checkbox.check-success input").prop('checked', 0);
    		this.checkNotification();
    }

}