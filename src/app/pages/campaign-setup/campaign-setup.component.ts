import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageService } from '../../@pages/components/message/message.service';
import { GetDataService } from '../../_services/getdata.service';
import { List } from "../../models/email-list";
import { TemplateList } from "../../models/template-list";
import { pagesToggleService } from '../../@pages/services/toggler.service'
import { ActivatedRoute, Router } from '@angular/router';

import * as $ from 'jquery';

@Component({
    selector: 'app-campagin-setup',
    templateUrl: './campaign-setup.component.html',
    styleUrls: ['./campaign-setup.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CampaignSetupComponent implements OnInit {

    @ViewChild('mdSlideUp') mdSlideUp: ModalDirective;
    @ViewChild('editMailContentModal') editMailContentModal: ModalDirective;
    @ViewChild('saveTemplateModal') saveTemplateModal: ModalDirective;
    @ViewChild('schduleModal') schduleModal: ModalDirective;
    @ViewChild('draftModal') draftModal: ModalDirective;
    @ViewChild('EmailTemplateModal') EmailTemplateModal: ModalDirective;
    @ViewChild('saveAsTemplateModal') saveAsTemplateModal: ModalDirective;

    notificationModel:any ={
        type:"circle",
        message:"Please enter campaign name!",
        color:"danger",
        position:"top-right",
        current:0
    };

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

    notificationMessages = [
        {message: "Please enter campaign name!"},
        {message: "Please select prospector from list!"},
        {message: "Please select mailbox!"},
        {message: "Please save campaign!"}
    ]

    messageEditable: Boolean = false;

    campaignName: string = null;
    subject: string = null;
    disabled: Boolean = true;

    disabledTabs ={
        messagingTab: true,
        previewTab: true,
        emailSettingTab: true,
    }

    clickAdd: Boolean = false;
    addOnLists = [];
    addNum = 0;

    addFollowLists = [];
    addFollowNum = 0;

    selectOnDayOptions = [
        { value: '1', label: '1 Day' },
        { value: '2', label: '2 Days' },
        { value: '3', label: '3 Days' }
    ];

    selectedStep = 0;

    selectedProspector;

    prospectorOptions = [
        { value: 'jack', label: 'Jacks' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'disabled', label: 'Disabled', disabled: true }
    ];

    selectedMailbox;
    mailboxOptions = [
        { value: 'jack', label: 'Jacks' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'disabled', label: 'Disabled', disabled: true }
    ]

    emailList =[];
    selectedContact: any;
    selectedEmail: List;
    isEmailSelected = false;

    filterKeyword: string = null;

    maximEmailPerDay;
    delayTime;
    markStatus;
    markStatusOptions = [
        { value: 'completed', label: 'Mark as completed' },
        { value: 'unread', label: 'Mark as unread' },
        { value: 'pending', label: 'Pending' }
    ]

    start_date;
    end_date;

    fileName;

    templateName;

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

    insertList = [
        {label: "First Name", value: "John"},
        {label: "Last Name", value: "Doe"},
        {label: "Company", value: "Symbiotries"},
    ]

    templateList = [];

    selectedTemplate: TemplateList;

    isTemplateSelected = false;

    templateIconClickEvent: any;

    subjectVal;

    selectedSaveAsTemplate: TemplateList = {
        // id: 0,
        title: '',
        template: ''
    };

    constructor (
        private _notification: MessageService,
        private _service: GetDataService,
        private toggler:pagesToggleService,
        private router: Router
    ) {

    }

    ngOnInit() {
        this._service.getEmails().subscribe(list => {
            this.emailList = list.emails;
        });

        this._service.getTimezones().subscribe(list => {
            this.timezoneList = list;
        });

        this._service.getEmailTemplates().subscribe(list => {
            this.templateList = list;
        });

        setTimeout(() => {
          this.toggler.toggleFooter(false);
        });

        this.toggler.setPageContainer("full-height");
        this.toggler.setContent("full-height");

        $(document).click(function(e){
            var container = $(".insert-dropdown");

            // If the target of the click isn't the container
            if(!container.is(e.target) && container.has(e.target).length === 0 && !$(e.target.parentNode.parentElement).hasClass('code-btn')){
                container.addClass('hidden');
            }
        });
    }

    editCampaignName() {
        this.disabled = false;
        this.messageEditable = false;
    }

    saveCampaignName() {
        this.disabled = true;
    }

    dropCampaign() {
        this.draftModal.show();
    }

    navigateToMessaging() {
        if (!this.campaignName) {
            this.notificationModel.message = this.notificationMessages[0].message;
            this.createBasicNotification();
        }

        if (!this.selectedProspector) {
            this.notificationModel.message = this.notificationMessages[1].message;
            this.createBasicNotification();
        }

        if (!this.selectedMailbox) {
            this.notificationModel.message = this.notificationMessages[2].message;
            this.createBasicNotification();
        }

        if (this.campaignName && this.selectedProspector && this.selectedMailbox) {
            this.disabledTabs.messagingTab = false;
            this.selectedStep = 1;
            // if (!this.disabled) {
            //     this.saveCampaignNotification();
            // } else {
            //     this.disabledTabs.messagingTab = false;
            //     this.selectedStep = 1;
            // }
        }
    }

    createBasicNotification() {
        this._notification.create(
        this.notificationModel.color,
        this.notificationModel.message,
        {
            Title: "John Doe",
            imgURL: "/assets/img/profiles/avatar.jpg",
            Position: this.notificationModel.position,
            Style: this.notificationModel.type,
            Duration:0
        });
    }

    saveCampaignNotification() {
        this.notificationModel.message = this.notificationMessages[3].message;
        this.createBasicNotification();
    }

    navigateToPreview() {
        this.disabledTabs.previewTab = false;
        this.selectedStep = 2;
    }

    navigateToEmailSetting() {
        this.disabledTabs.emailSettingTab = false;
        this.selectedStep = 3;
    }

    goToPrevTab() {
        if (this.selectedStep > 0) {
            this.selectedStep--;
        }
    }

    saveMessage(event) {
        this.saveTemplateModal.show();
    }

    editMessage(event) {
        // this.messageEditable = true;
    }

    deleteMessage(addon_id) {
        var index = this.addOnLists.indexOf(addon_id);
        if (index > -1) {
            this.addOnLists.splice(index, 1);
        }

        this.disableClickAdd();
    }

    addOnClick() {
        this.addOnLists.push(this.addNum);
        this.addNum ++
        this.clickAdd = true;
    }

    editFollowUpMessage(event) {

    }

    saveFollowUpMessage(event) {

    }

    deleteFollowUpMessage(add_follow_up_id) {
        var index = this.addFollowLists.indexOf(add_follow_up_id);
        if (index > -1) {
            this.addFollowLists.splice(index, 1);
        }
        this.disableClickAdd();
    }

    addFollowUpClick() {
        this.addFollowLists.push(this.addFollowNum);
        this.addFollowNum ++
        this.clickAdd = true;
    }

    disableClickAdd() {
        if (this.addFollowLists.length === 0 && this.addOnLists.length === 0) {
            this.clickAdd = false;
        }
    }

    onSelect(item: List, index_i, index_j): void {
        this.selectedEmail = item;
        this.selectedContact = this.emailList[index_i];
        this.isEmailSelected = true;
        let btn_id = '#btn_' + (index_i + 1) + '_' + (index_j + 1);
        $(btn_id).closest('ul').find('.active').removeClass('active');
        $(btn_id).addClass('active');
    }

    launchCampaign() {
        this.router.navigate(['/emailer/campaign'], { queryParams: { campaignExist: true } });
    }

    onBack(){
        this.isEmailSelected = false;
    }

    importOwnList() {
        this.mdSlideUp.show();
    }

    uploadFile() {
        setTimeout(() => {
            $('.step-upload-csv').removeClass('current-step').addClass('complete-step');
            $('.step-map-attribute').addClass('current-step');
            $('.upload-csv-section').addClass('hidden');
            $('.map-attributes').removeClass('hidden');
        }, 500);
    }

    selectFile(event) {
        this.fileName = event.target.files[0].name;
    }

    removeSelectedFile() {
        this.fileName = null;
    }

    uploadEvent() {
        $('input[type="file"]').click();
    }

    editMailContent() {
        this.editMailContentModal.show();
    }

    changeMessage() {
        setTimeout(() =>  {
            this.editMailContentModal.hide();
        }, 700);
    }

    sectionChanged() {

    }

    contentChanged() {
        
    }

    searchContact() {
        var searchString = this.filterKeyword;

        $(".split-list .list-view-wrapper .list-view-group-container").each(function(index, value) {
            
            var currentName = $(value).text()
            if( currentName.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
               $(value).show();
            } else {
                $(value).hide();
            }
            
        });
    }

    ChangeText(e) {
        var text = e.target.textContent;
        var saveBtn = $(e.target.closest('.card-default')).find('.save-btn');
        if (text.length > 0) {
            saveBtn.css('display', 'block');
        } else {
            saveBtn.css('display', 'none');
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

    showInsertDropDown(e) {
        if ($(e.target.closest('.card-default')).find('.insert-dropdown').hasClass('hidden')) {
            $(e.target.closest('.card-default')).find('.insert-dropdown').removeClass('hidden');
        } else {
            $(e.target.closest('.card-default')).find('.insert-dropdown').addClass('hidden');
        }
    }

    insertValue(e, value) {
        var currentText = $(e.target.closest('.card-default')).find('.ql-editor').text();
        currentText += ' ' + value;
        $(e.target.closest('.card-default')).find('.ql-editor').text(currentText);
        var saveBtn = $(e.target.closest('.card-default')).find('.save-btn');
        if (currentText.length > 0) {
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

    insertTemplateToEditor(template) {
        setTimeout(() => {
            $(this.templateIconClickEvent.target.closest('.card-default')).find('.ql-editor').html(template);
            $(this.templateIconClickEvent.target.closest('.card-default')).find('.save-btn').css('display', 'block');
            this.EmailTemplateModal.hide();
        }, 700);
    }

    switchSub(e) {
        var subject = $(e.target.closest('.message-block')).find('.subject');
        if (subject.val().length > 0) {
            this.subjectVal = subject.val();
            subject.val('');
            subject.attr('placeholder', 'Send as New Email | Subject:');
        } else {
            subject.val(this.subjectVal);
        }
    }

    toogleActionBtn(e) {
        if ($(e.target).hasClass('fa-save')) {
            this.saveAsTemplateModal.show();
            this.templateIconClickEvent = e;
            this.selectedSaveAsTemplate.title = $(e.target.closest('.message-block')).find('.subject').val();
            this.selectedSaveAsTemplate.template = $(e.target.closest('.card-default')).find('.ql-editor').html();
        } else {
            $(e.target).removeClass('fa-pencil');
            $(e.target).removeClass('campaign-edit');
            $(e.target).addClass('fa-save');
            $(this.templateIconClickEvent.target.closest('.card-default')).find('.ql-editor').attr('contenteditable', 'true');
        }
    }

    saveTemplate() {
        setTimeout(() => {
            this.saveTemplateModal.hide();
            $(this.templateIconClickEvent.target).removeClass('fa-save');
            $(this.templateIconClickEvent.target).addClass('fa-pencil').addClass('campaign-edit');
            $(this.templateIconClickEvent.target.closest('.card-default')).find('.ql-editor').attr('contenteditable', 'false');
        }, 700);
        this.templateName = null;
    }

    showSaveAsModal() {
        this.EmailTemplateModal.hide();
        this.saveAsTemplateModal.show();
    }
    
    useSelectedTemplate(subject, template) {
        $(this.templateIconClickEvent.target.closest('.addon')).find('.subject').val(subject);
        $(this.templateIconClickEvent.target.closest('.card-default')).find('.ql-editor').html(template);
        this.EmailTemplateModal.hide();
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