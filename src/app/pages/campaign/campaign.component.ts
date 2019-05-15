import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { GetDataService } from '../../_services/getdata.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-campagin',
    templateUrl: './campaign.component.html',
    styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {

    columnsDynamic = [
        { name: 'Status' },
        { name: 'Campaign Name' },
        { name: 'Leads' },
        { name: 'Delivered' },
        { name: 'Opens' },
        { name: 'Replies' },
    ];

    campaignRows = [];
    campaignExist: Boolean = false;

    temp = [];

    @ViewChild(DatatableComponent) tableDynamic: DatatableComponent;

    scrollBarHorizontal = (window.innerWidth < 960);
    columnModeSetting = (window.innerWidth < 960) ? 'standard':'force';

    sub: any;

    @ViewChild('mdSlideUp') mdSlideUp: ModalDirective;

    selectedCampaignId;

    constructor (
        private router: Router,
        private route: ActivatedRoute,
        private _service: GetDataService
    ) {
        this.fetch((data) => {
            this.temp = [...data];
            this.campaignRows = data;
        });
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 960);
            this.columnModeSetting = (window.innerWidth < 960) ? 'standard':'force';
        };
    }

    ngOnInit() {
        this.sub = this.route
            .queryParams
            .subscribe(params => {
            this.campaignExist = params['campaignExist'];
        });

        this.getCampaignData();

    }

    fetch(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', 'assets/data/campaign.json');

        req.onload = () => {
            cb(JSON.parse(req.response));
        };

        req.send();
    }    

    getCampaignData() {
        this._service.getCampaignData().subscribe(res => {
            this.campaignRows = res;
        })
    }

    goToCampaignSetup() {
        this.router.navigate(['/emailer/campaign-setup']);
    }

    editCampaign(campaignId) {
        var url = 'emailer/campaign/edit/' + campaignId;
        window.open(url, "_blank");
    }

    showDeleteCampaignConfirmModal(campaignId) {
        this.mdSlideUp.show();
        this.selectedCampaignId = campaignId
    }

    deleteCampaign() {
        setTimeout(() => {
            $('#action_' + this.selectedCampaignId).closest('tr').hide();
            this.mdSlideUp.hide();
        }, 500);
    }

    updateFilter(e) {
        const val = e.target.value.toLowerCase();

        // filter our data
        const temp = this.temp.filter(function(d) {
          return d.campaignName.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.campaignRows = temp;
        // Whenever the filter changes, always go back to the first page
        this.tableDynamic.offset = 0;

    }

}