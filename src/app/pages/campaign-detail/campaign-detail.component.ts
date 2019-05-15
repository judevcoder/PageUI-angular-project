import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { InfiniteScrollEvent } from 'ngx-infinite-scroll';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GetDataService } from '../../_services/getdata.service';
import { List } from "../../models/email-list";
import { TemplateList } from "../../models/template-list";
import * as $ from 'jquery';

declare let d3: any;
declare var pg: any;

@Component({
    selector: 'app-campagin-detail',
    templateUrl: './campaign-detail.component.html',
    styleUrls: ['./campaign-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CampaignDetailComponent implements OnInit {

    @ViewChild('NotesModal') NotesModal: ModalDirective;
    @ViewChild('TagModal') TagModal: ModalDirective;
    @ViewChild('EmailTemplateModal') EmailTemplateModal: ModalDirective;
    @ViewChild('saveTemplateModal') saveTemplateModal: ModalDirective;
    @ViewChild('schduleModal') schduleModal: ModalDirective;
    @ViewChild('saveAsTemplateModal') saveAsTemplateModal: ModalDirective;

    options;
    nvd3LineOptions;
    nvd3LineData;
    nvd3LineAreaOptions;
    nvd3LineAreaData;
    myForm: FormGroup;
    fixChart = false;

    disabled = true;

    editorModules = {
    //https://github.com/KillerCodeMonkey/ngx-quill
        toolbar: [
            [{ 'font': [] }],
            [{ size: [ 'small', false, 'large', 'huge' ]}],
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image']  
        ]
    };

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

    initialSubject;
    firstFollowUpSubject;
    secondFollowUpSubject;

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

    notesList = [];

    noteContent;

    availableTags: string[] = [
        'CSV',
        'Internal Users',
        'Startup Annual Plan'
    ]

    selectedTag;

    tagList = [];

    showMore = false;
    hideNote = false;

    insertList = [
        {label: "First Name", value: "John"},
        {label: "Last Name", value: "Doe"},
        {label: "Company", value: "Symbiotries"},
    ]

    templateList = [];

    selectedTemplate: TemplateList;

    isTemplateSelected = false;

    templateIconClickEvent: any;

    templateName;

    subjectPlaceholderText;

    schedulesOptionList = [
        {value: 'est', label: 'EST'},
        {value: 'cst', label: 'CST'},
        {value: 'pst', label: 'PST'},
    ]

    selectedSchedule;

    scheduleDays = [
        {"day": "Mon", "state": "add"},
        {"day": "Tue", "state": "add"},
        {"day": "Wed", "state": "add"},
        {"day": "Thu", "state": ""},
        {"day": "Fri", "state": ""},
        {"day": "Sat", "state": "add"},
        {"day": "Sun", "state": ""}
    ]

    timezoneList: any;
    selectedTimeZone;

    start_date;
    end_date;

    subjectVal;

    selectedSaveAsTemplate: TemplateList = {
        // id: 0,
        title: '',
        template: ''
    };

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

        this._service.getTimezones().subscribe(list => {
            this.timezoneList = list;
        });

        this.getAllActivities();

        this.loadMessages();

        this._service.getEmails().subscribe(list => {
            this.emailList = list.emails;
        });

        this._service.getEmailTemplates().subscribe(list => {
            this.templateList = list;
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
            .on('click', '.overview-tabs li a', function(e) {
                // console.log(e);
                // var tabSelectedIndex = $('.overview-tabs .tab-wrapper pg-tabs-nav').attr('ng-reflect-selected-index');
                if (e.target.text.replace(/\s/g, '') == "Activities") {
                    $('.overview-tabs .tab-wrapper .tab-content-wrapper .tab-content').attr('style', 'margin-left: -100% !important');
                } else {
                    $('.overview-tabs .tab-wrapper .tab-content-wrapper .tab-content').attr('style', 'margin-left: 0 !important');
                }
            })

        $(document).click(function(e){
            var container = $(".insert-dropdown");

            // If the target of the click isn't the container
            if(!container.is(e.target) && container.has(e.target).length === 0 && !$(e.target.parentNode.parentElement).hasClass('code-btn')){
                container.addClass('hidden');
            }
        });

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
            this.initialSubject = list['emails'][0]['list'][0]['subject'];
            this.initialHtmlText = list['emails'][0]['list'][0]['body'];

            this.firstFollowUpSubject = list['emails'][0]['list'][1]['subject'];
            this.firstFollowUpHtmlText = list['emails'][0]['list'][1]['body'];

            this.secondFollowUpSubject = list['emails'][0]['list'][2]['subject'];
            this.secondFollowUpHtmlText = list['emails'][0]['list'][2]['body'];
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

    addOnClick() {
        this.addOnLists.push(this.addNum);
        this.addNum ++;
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

    copyEmail(email) {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = email;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "Copied";
        document.body.removeChild(selBox);
    }

    initialText() {
        var tooltip = document.getElementById("myTooltip");
        tooltip.innerHTML = "Copy Email";
    }

    
    showAddNotesModal() {
        this.NotesModal.show();
    }

    addNotes() {
        if (this.noteContent) {
            let note = {
                content: null,
                createdAt: null
            }
            note['content'] = this.noteContent;
            note['createdAt'] = new Date();
            this.notesList.push(note);
            this.noteContent = null;
            if (this.notesList.length > 1) {
                this.hideNote = true;
            }
        } else {
            alert('Please enter Note');
        }

        this.NotesModal.hide();
    }

    showAddTagModal() {
        this.TagModal.show();
    }

    editNote(index) {
        this.noteContent = this.notesList[index]['content'];
        this.NotesModal.show();
    }

    deleteNote(index) {
        this.notesList.splice(index,1);
        if (this.notesList.length === 1) {
            this.hideNote = false;
            this.showMore = false;
        }
    }

    addTag(tagName) {
        let tag = tagName;
        this.tagList.push(tag);
        this.TagModal.hide();
        this.selectedTag = null;
    }

    removeTag(index) {
        this.tagList.splice(index, 1);
    }

    hideNotes() {
        this.hideNote = false;
        this.showMore = true;
    }

    showAllNotes() {
        this.showMore = false;
        this.hideNote = true;
    }

    showInsertDropDown(e) {
        if ($(e.target.closest('.input-textarea')).find('.insert-dropdown').hasClass('hidden')) {
            $(e.target.closest('.input-textarea')).find('.insert-dropdown').removeClass('hidden');
        } else {
            $(e.target.closest('.input-textarea')).find('.insert-dropdown').addClass('hidden');
        }
    }

    insertValue(e, value) {
        var htmlVal = $(e.target.closest('.input-textarea')).find('.ql-editor').html();
        htmlVal += '<p>' + value + '</p>';
        $(e.target.closest('.input-textarea')).find('.ql-editor').html(htmlVal);
        var saveBtn = $(e.target.closest('.card-toolbar')).find('.save-btn');
        if ($(e.target.closest('.input-textarea')).find('.ql-editor').text().length > 0) {
            saveBtn.css('display', 'block');
        } else {
            saveBtn.css('display', 'none');
        }
    }

    insertTemplate(e) {
        this.EmailTemplateModal.show();
        this.templateIconClickEvent = e;
    }

    onSelectTemplate(item: TemplateList) {
        this.selectedTemplate = item;
        this.isTemplateSelected = true;
    }

    ChangeText(e) {
        var text = e.target.textContent;
        var saveBtn = $(e.target.closest('.card-toolbar')).find('.save-btn');
        if (text.length > 0) {
            saveBtn.css('display', 'block');
        } else {
            saveBtn.css('display', 'none');
        }
    }

    saveTemplate() {
        setTimeout(() => {
            this.saveTemplateModal.hide();
            $(this.templateIconClickEvent.target).removeClass('fa-save');
            $(this.templateIconClickEvent.target).addClass('fa-pencil').addClass('campaign-edit');
            $(this.templateIconClickEvent.target.closest('.input-textarea')).find('.ql-editor').attr('contenteditable', 'false');
        }, 700);
        this.templateName = null;
    }

    switchSub(e) {
        var subject = $(e.target.closest('.set-follow-subject')).find('.subject');
        if (subject.val().length > 0) {
            this.subjectVal = subject.val();
            subject.val('');
            subject.attr('placeholder', 'Send as New Email | Subject:');
        } else {
            subject.val(this.subjectVal);
        }
    }

    showScheduleModal() {
        this.schduleModal.show();
    }

    addScheduleDay(state, index) {
        if (state == 'add') {
            $('#btn_' + index).removeClass('add');
            this.scheduleDays[index]['state'] = null;
        } else {
            $('#btn_' + index).addClass('add');
            this.scheduleDays[index]['state'] = 'add';
        }
    }

    addNew() {

    }

    saveSchedule() {
        setTimeout(() => {
            this.schduleModal.hide();
        }, 700);
    }

    showSaveAsModal() {
        this.EmailTemplateModal.hide();
        this.saveAsTemplateModal.show();
    }
    
    useSelectedTemplate(subject, template) {
        $(this.templateIconClickEvent.target.closest('.addon')).find('.subject').val(subject);
        $(this.templateIconClickEvent.target.closest('.input-textarea')).find('.ql-editor').html(template);
        this.EmailTemplateModal.hide();
    }

    toogleActionBtn(e) {
        if ($(e.target).hasClass('fa-save')) {
            this.saveAsTemplateModal.show();
            this.templateIconClickEvent = e;
            this.selectedSaveAsTemplate.title = $(e.target.closest('.card-default')).find('.subject').val();
            this.selectedSaveAsTemplate.template = $(e.target.closest('.card-default')).find('.ql-editor').html();
        } else {
            $(e.target).removeClass('fa-pencil');
            $(e.target).removeClass('campaign-edit');
            $(e.target).addClass('fa-save');
            $(this.templateIconClickEvent.target.closest('.input-textarea')).find('.ql-editor').attr('contenteditable', 'true');
        }
    }

    onSelectSaveAsTemplate(template) {
        this.selectedSaveAsTemplate = template;
    }

    showSaveTemplateModal() {
        setTimeout(() => {
            this.saveAsTemplateModal.hide();
            this.saveTemplateModal.show();
        }, 700);

    }

    saveAsTemplate() {
        setTimeout(() => {
            this.saveTemplateModal.hide();
            $(this.templateIconClickEvent.target).removeClass('fa-save');
            $(this.templateIconClickEvent.target).addClass('fa-pencil').addClass('campaign-edit');
            $(this.templateIconClickEvent.target.closest('.input-textarea')).find('.ql-editor').attr('contenteditable', 'false');
        }, 700);
        this.templateName = null;
    }

}
