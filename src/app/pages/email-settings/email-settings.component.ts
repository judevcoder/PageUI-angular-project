import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';

@Component({
    selector: 'app-email-settings',
    templateUrl: './email-settings.component.html',
    styleUrls: ['./email-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EmailSettingsComponent implements OnInit {

    @ViewChild('addMailboxModal') addMailboxModal: ModalDirective;
    @ViewChild('connectToMailModal') connectToMailModal: ModalDirective;

    emailType;

    mailboxDataList = [
        {
            senderName: "Jason Briggs",
            email: "jason@cloudhub.com",
            provider: "G SUITE",
            lastSync: "Today 14:00 EST",
        },
        {
            senderName: "Tara Philipps",
            email: "tara@cloudhub.com",
            provider: "G SUITE",
            lastSync: "2 days ago 11:00 EST",
        }
    ]

    unsubscribeText;
    unsubscribeLangPageText;

    constructor () {}

    ngOnInit() {
    }

    addMailbox() {
        this.addMailboxModal.show();
    }

    selectEmailOption(type) {
        $('.email-sending-option .email-option').removeClass('active');
        if (type == 'google') {
            $('.google-account').addClass('active');
        } else {
            $('.gmail-alias').addClass('active');
        }

        this.emailType = type;

        $('.connect-btn').removeAttr('disabled');

    }

    connectToMailAccount() {
        this.addMailboxModal.hide();
        setTimeout(() => {
            this.connectToMailModal.show();
        }, 500);
    }

    addAlias() {

    }

}