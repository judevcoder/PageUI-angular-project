import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { InfiniteScrollEvent } from 'ngx-infinite-scroll';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GetDataService } from '../../_services/getdata.service';
import { List } from "../../models/email-list";
import * as $ from 'jquery';

declare let d3: any;
declare var pg: any;

@Component({
    selector: 'app-edit-campaign',
    templateUrl: './edit-campaign.component.html',
    styleUrls: ['./edit-campaign.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EditCampaignComponent implements OnInit {

    options;
    nvd3LineOptions;
    nvd3LineData;
    nvd3LineAreaOptions;
    nvd3LineAreaData;
    myForm: FormGroup;
    fixChart = false;

    disabled = true;

    campaignData: object = {
        id: 1,
        status: "true",
        campaignName: "The Damned Above the Cavern",
        leads: 240,
        delivered: 110  ,
        opens: 21,
        replies: 7
    }

    campaignName;
    selectedList;
    selectedCampaignMessage;

    listOptions = [
        { value: 'jack', label: 'Jacks' },
        { value: 'lucy', label: 'Lucy' },
    ];

    campaignMessageOptions = [
        { value: '1', label: '1st Message' },
        { value: '2', label: '2nd Message' },
        { value: '3', label: '3rd Message' },
        { value: '4', label: '4th Message' },
        { value: '5', label: '5th Message' },
    ];

    activities = [];
    activity = {
        id: 1,
        email: "ash.pallickal@gmail.com",
        type: "2nd message",
        date: "2019-04-10 05:03:42",
        stats: "opened"
    }

    activityLength: any;

    displayActivities = [];
    loadActivityCount: any;

    viewMore = false;
    activitiesOptions = [
        { value: 'Opened', label: 'Opened' },
        { value: 'sent', label: 'sent' },
        { value: 'Delivered', label: 'Delivered' },
    ];

    initialHtmlText ="<p><u>Testing</u></p>";
    firstFollowUpHtmlText ="<p><u>Testing</u></p>";
    secondFollowUpHtmlText ="<p><u>Testing</u></p>";
    // selectedEmailHtmlText;

    messageEditable: Boolean = false;

    addFollowLists = [];

    addOnLists = [];

    addNum = 0;

    addFollowNum = 3;

    isEmailSelected = false;

    filterContactKeyword: string = null;

    selectedEmail: List;

    emailList =[];

    profileData: object = {
        id: 1,
        image: "assets/img/profiles/1.jpg",
        contactDetails: {
            id: 1,
            name: "Randy Kreider CPA",
            role: "CEO",
            linkedSocial: {
                linkedin: true,
                twitter: true,
                facebook: true
            }
        },
        businessEmail: {
            email: "randy@symbiotries.com",
            status: "primary"
        },
        companyDetails: {
            name: "Symbiotries, Inc.",
            link: "symbiotries.com",
            linkedSocial: {
                linkedin: true,
                twitter: true,
                facebook: false
            },
            image: "assets/img/company/Apple.png",
            address: "One Infinite Loop Cupertino Califonia 95014 United States",
            phone: "(408) 996-1010",
            telephone: "(408) 996-0275",
            contactName: "Consumer Electronics",
            contactCount: 10485,
            foundDate: "1976-4-1",
            earned: 182795000000,
            description: "Your team matters just as much as your great business idea. A company overview (also known as company information or a company summary) is an essential part of a business plan. ... It usually appears after the executive summary in your business plan."
        },
        city: "Cupertino",
        phone: "(408) 996-1010",
        state: "Minnesota",
        address: "One Infinite Loop Cupertino Califonia 95014 United States",
        university: "University of Minnesota-Twin Cities",
        description: "Angular is a TypeScript-based open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations. Angular is a complete rewrite from the same team that built AngularJS."
    };

    selectedContact: any;

    viewMoreProfile = false;
    longProfileDes = false;

    viewMoreCompany = false;
    longCompanyDes = false;

    scrollDistance = 1;
    scrollUpDistance = 2;

    maximEmailPerDay;
    delayTime;
    markStatus;
    markStatusOptions = [
        { value: 'completed', label: 'Mark as completed' },
        { value: 'unread', label: 'Mark as unread' },
        { value: 'pending', label: 'Pending' }
    ]

    _date;

    data = [];
    tableData = [];

    selectFollowDayOptions = [
        { value: '1', label: '1 Day' },
        { value: '2', label: '2 Days' },
        { value: '3', label: '3 Days' }
    ];

    selectedOption;

    @ViewChild('editMailContentModal') editMailContentModal: ModalDirective;

    constructor (
        private router: Router,
        private route: ActivatedRoute,
        private _service: GetDataService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        let campaignId = this.route.snapshot.params['id'];
        this.loadCampaignData(campaignId);

        this.getAllActivities();

        this.loadMessages();

        this._service.getEmails().subscribe(list => {
            this.emailList = list.emails;
        });

        if (this.profileData['description'].length > 75) {
            this.longProfileDes = true;
            this.viewMoreProfile = true;
        };

        if (this.profileData['companyDetails']['description'].length > 75) {
            this.longProfileDes = true;
            this.viewMoreCompany = true;
        };

        $(document)
            .off('click', '.overview-tabs li a')
            .on('click', '.overview-tabs li a', function() {
                var tabSelectedIndex = $('.overview-tabs .tab-wrapper pg-tabs-nav').attr('ng-reflect-selected-index');
                if (tabSelectedIndex == '1') {
                    $('.overview-tabs .tab-wrapper .tab-content-wrapper .tab-content').attr('style', 'margin-left: -100% !important');
                } else {
                    $('.overview-tabs .tab-wrapper .tab-content-wrapper .tab-content').attr('style', 'margin-left: 0 !important');
                }
            })

        // this.initRealtimeChart();
        this.initBarChart();
        this.myForm = this.formBuilder.group({
            radio: 'A'
        });

        this.loadStatusData();

    }

    initRealtimeChart() {
        this._service.getChartSampleData().subscribe(d => {
        this.nvd3LineData = d.nvd3.chart;
        this.nvd3LineAreaData = d.nvd3.monthSales;
        this.nvd3LineOptions = {
            chart: {
                type: 'lineChart',
                color: [
                    'rgb(0,0,0)',
                    'rgba(0, 123, 232, 1)',
                    'rgb(0,232,21)', //south america

                    'rgb(232,15,0)', //europe
                    'rgb(112,33,232)', //europe
                    'rgba(0,0,0,0.56)', //europe
                  ],
                height: 350,
                x: function (d) {
                    return d[0];
                },
                y: function (d) {
                    return d[1];
                  },
                showValues: true,
                useInteractiveGuideline: true,
                showControls: true,
                clipEdge: true,
                xAxis: {
                    tickFormat: (d) => {
                        return d3.time.format('%b /%d')(new Date(d));
                    }
                },
                yAxis: {
                    tickFormat: (d) => {
                        return d;
                    }
                }
            }
        };
        setTimeout(() => {
            this.fixChart = true;
            }, 10);
        });
    }

    initBarChart() {
        this.options = {
            chart: {
                type: 'multiBarChart',
                height: 450,
                x: function (d) {
                  return d[0];
                },
                y: function (d) {
                  return d[1];
                },
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                },
                xAxis: {
                    tickFormat: (d) => {
                        return d3.time.format('%b /%d')(new Date(d));
                    }
                },
                yAxis: {
                    tickFormat: (d) => {
                        return d;
                    }
                }
            }
        };
    }

    loadCampaignData(campaign_id) {
        this._service.getCampaignData().subscribe(res => {
            let campaign = res.filter(obj => {
                return obj.id === parseInt(campaign_id);
            })

            this.campaignData['id'] = campaign[0]['id'];
            this.campaignData['campaignName'] = campaign[0]['campaignName'];
            this.campaignData['status'] = campaign[0]['status'];
            this.campaignData['leads'] = campaign[0]['leads'];
            this.campaignData['delivered'] = campaign[0]['delivered'];
            this.campaignData['opens'] = campaign[0]['opens'];
            this.campaignData['replies'] = campaign[0]['replies'];
            this.campaignName = campaign[0]['campaignName'];

      })
    }

    loadMessages() {
        this._service.getEmails().subscribe(list => {
            this.initialHtmlText = "<p><u>Sub: " + list['emails'][0]['list'][0]['subject'] + "</u></p>";
            this.initialHtmlText += "<br><br>" + list['emails'][0]['list'][0]['body'];
            this.firstFollowUpHtmlText = "<p><u>Sub: " + list['emails'][0]['list'][1]['subject'] + "</u></p>";
            this.firstFollowUpHtmlText += "<br><br>" + list['emails'][0]['list'][1]['body'];
            this.secondFollowUpHtmlText = "<p><u>Sub: " + list['emails'][0]['list'][2]['subject'] + "</u></p>";
            this.secondFollowUpHtmlText += "<br><br>" + list['emails'][0]['list'][2]['body'];
        });
    }

    loadStatusData() {
        this._service.getChartSampleData().subscribe(data => {
            this.data = data.nvd3.chart;
            this.data.forEach(element => {
                let tableVal = {
                  statusName: element.key,
                  statusCount: null
                }
                element.values.forEach(val => {
                  tableVal.statusCount += +val[1];
                })
                this.tableData.push(tableVal);
              });
        })
      }

    getAllActivities() {
        this._service.getActivities().subscribe(res => {
            this.activities = res;
            this.initActivities();
        })
        
    }
 
    initActivities() {
        this.activityLength = this.activities.length;
        if (this.activityLength > 15) {
            this.loadActivityCount = 15
            this.viewMore = true;
        } else {
            this.loadActivityCount = this.activityLength
            this.viewMore = false;
        }

        this.appendActivity(0, this.loadActivityCount);

    }

    appendActivity(startIndex, endIndex) {
        for (var i = startIndex; i < endIndex; i++) {
            this.displayActivities.push(this.activities[i]);
        }
    }

    loadViewActivities () {
        if (this.loadActivityCount >= 15 && this.activityLength > this.loadActivityCount) {
            const start = this.loadActivityCount;
            this.loadActivityCount += 15;
            if (this.loadActivityCount > this.activityLength) {
                this.loadActivityCount = this.activityLength;
            }
            if (this.activityLength > this.loadActivityCount) {
                this.viewMore = true;
            } else {
                this.viewMore = false;
            }
            this.appendActivity(start, this.loadActivityCount);
        }
        
    }

    onUp() {

    }

    editCampaignName() {
        this.disabled = false;
    }

    saveCampaignName() {
        this.disabled = true;
    }

    onSelectionChanged = (event) =>{
        if(event.oldRange == null){
            this.onFocus();
        }
        if(event.range == null){
            this.onBlur();
        }
    }

    onContentChanged = (event) =>{
        console.log();
    }

    firstFollowOnSelectionChanged = (event) =>{
        if(event.oldRange == null){
            this.onFocus();
        }
        if(event.range == null){
            this.onBlur();
        }
    }

    firstFollowOnContentChanged = (event) =>{
        console.log();
    }

    secondFollowOnSelectionChanged = (event) =>{
        if(event.oldRange == null){
            this.onFocus();
        }
        if(event.range == null){
            this.onBlur();
        }
    }

    secondFollowOnContentChanged = (event) =>{
        // console.log(event.html);
        console.log();
    }

    onFocus = () =>{
        console.log();
    }

    onBlur = () =>{
        console.log();
    }

    addFollowUpClick() {
        this.addFollowLists.push(this.addFollowNum);
        this.addFollowNum ++;
    }

    // addFollowUpClick() {
    //     return new Promise((resolve, reject) => {
    //         this.addFollowLists.push(this.addFollowNum);
    //         resolve();
    //     })
        
    //     // setTimeout(() => {
    //     //     $('#follow-up_' + this.addFollowNum).closest('pg-collapse').find('.card-header').find('.card-title a').text("Follow-Up" + this.addFollowNum);
    //     // }, 100);
    // }

    // addTitle() {
    //     $('#follow-up_' + this.addFollowNum).closest('pg-collapse').find('.card-header').find('.card-title a').text("Follow-Up" + this.addFollowNum);
    //     this.addFollowNum ++;
    // }

    // addFollow() {
    //     this.addFollowUpClick().then(res => this.addTitle());
    // }

    addOnClick() {
        this.addOnLists.push(this.addNum);
        this.addNum ++;
    }

    saveMessage(event) {
        // this.messageEditable = true;
    }

    editMessage(event) {
        // this.messageEditable = true;
    }

    deleteMessage(add_id, type) {
        if (type == "follow") {
            var index = this.addFollowLists.indexOf(add_id);
                if (index > -1) {
                this.addFollowLists.splice(index, 1);
            }
        } else {
            var index = this.addOnLists.indexOf(add_id);
                if (index > -1) {
                this.addOnLists.splice(index, 1);
            }
        }

    }

    onSelect(item: List, index_i, index_j): void {
        this.selectedEmail = item;
        this.selectedContact = this.emailList[index_i];
        this.isEmailSelected = true;
        let btn_id = '#btn_' + (index_i + 1) + '_' + (index_j + 1);
        $(btn_id).closest('ul').find('.active').removeClass('active');
        $(btn_id).addClass('active');
        this.getProfileData(parseInt(index_i) + 1);
    }

    getProfileData(id) {
        this._service.getNetworkProfileData().subscribe(res => {
            let profile = res.filter(obj => {
                return obj.id === parseInt(id);
            })
            this.profileData['id'] = profile[0]['id'];
            this.profileData['image'] = profile[0]['image'];
            this.profileData['city'] = profile[0]['city'];
            this.profileData['phone'] = profile[0]['phone'];
            this.profileData['address'] = profile[0]['address'];

            this.profileData['contactDetails']['id'] = profile[0]['contactDetails']['id'];
            this.profileData['contactDetails']['name'] = profile[0]['contactDetails']['name'];
            this.profileData['contactDetails']['role'] = profile[0]['contactDetails']['role'];
            this.profileData['contactDetails']['linkedSocial']['linkedin'] = profile[0]['contactDetails']['linkedSocial']['linkedin'];
            this.profileData['contactDetails']['linkedSocial']['twitter'] = profile[0]['contactDetails']['linkedSocial']['twitter'];
            this.profileData['contactDetails']['linkedSocial']['facebook'] = profile[0]['contactDetails']['linkedSocial']['facebook'];

            this.profileData['businessEmail']['email'] = profile[0]['businessEmail']['email'];
            this.profileData['businessEmail']['status'] = profile[0]['businessEmail']['status'];

            this.profileData['companyDetails']['name'] = profile[0]['companyDetails']['name'];
            this.profileData['companyDetails']['link'] = profile[0]['companyDetails']['link'];
            this.profileData['companyDetails']['linkedSocial']['linkedin'] = profile[0]['companyDetails']['linkedin'];
            this.profileData['companyDetails']['linkedSocial']['twitter'] = profile[0]['companyDetails']['linkedSocial']['twitter'];
            this.profileData['companyDetails']['linkedSocial']['facebook'] = profile[0]['companyDetails']['linkedSocial']['facebook'];
            this.profileData['companyDetails']['image'] = profile[0]['companyDetails']['image'];
            this.profileData['companyDetails']['address'] = profile[0]['companyDetails']['address'];
            this.profileData['companyDetails']['phone'] = profile[0]['companyDetails']['phone'];
            this.profileData['companyDetails']['telephone'] = profile[0]['companyDetails']['telephone'];
            this.profileData['companyDetails']['contactName'] = profile[0]['companyDetails']['contactName'];
        })
    }

    showMoreDetail(type) {
        if (type == "profile") {
            this.viewMoreProfile = false;
        } else {
            this.viewMoreCompany = false;
        }
    }

    showLess(type) {
        if (type == "profile") {
            this.viewMoreProfile = true;
        } else {
            this.viewMoreCompany = true;
        }
    }

    showChart() {
        $('.stats-table').addClass('hidden');
        $('.campaign-chart').removeClass('hidden');
    }

    showTable() {
        $('.campaign-chart').addClass('hidden');
        $('.stats-table').removeClass('hidden');
    }

    onBack(){
        this.isEmailSelected = false;
    }

    editMailContent() {
        this.editMailContentModal.show();
    }

    changeMessage() {
        setTimeout(() =>  {
            this.editMailContentModal.hide();
        }, 700);
    }

    searchContact() {
        var searchString = this.filterContactKeyword;

        $(".split-list .list-view-wrapper .list-view-group-container").each(function(index, value) {
            
            var currentName = $(value).text()
            if( currentName.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
               $(value).show();
            } else {
                $(value).hide();
            }
            
        });
    }

}
