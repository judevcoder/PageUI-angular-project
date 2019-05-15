import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GetDataService } from '../../_services/getdata.service';
import { List } from "../../models/email-list";
import { pagesToggleService } from '../../@pages/services/toggler.service';
import { QuillEditorComponent } from 'ngx-quill/src/quill-editor.component';
import Quill from 'quill';
import * as $ from 'jquery';

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InboxComponent implements OnInit {

    @ViewChild('NotesModal') NotesModal: ModalDirective;
    @ViewChild('TagModal') TagModal: ModalDirective;

	emailList =[];
	selectedEmail: List;
  	isEmailSelected = false;

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

  	selectedContact: any;

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

    viewMoreProfile: Boolean = false;
    longProfileDes: Boolean = false;

    viewMoreCompany: Boolean = false;
    longCompanyDes: Boolean = false;

    selectedIndex;

    filterKeyword;

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

    constructor (
    	private _service: GetDataService, 
    	private http: HttpClient,
    	private toggler:pagesToggleService
    	) {}

    ngOnInit() {
    	this._service.getEmails().subscribe(list => {
            this.emailList = list.emails;
        });

        if (this.profileData['description'].length > 75) {
        	this.longProfileDes = true;
            this.viewMoreProfile = true;
        };

        if (this.profileData['companyDetails']['description'].length > 75) {
        	this.longCompanyDes = true;
            this.viewMoreCompany = true;
        };
    }

    onSelect(item: List, index): void {
        $('.inbox-contact-item-' + index).closest('ul').find('.item.padding-15').removeClass('inbox-item-active');
        $('.inbox-contact-item-' + index).addClass('inbox-item-active');
    	this.selectedEmail = item;
    	this.isEmailSelected = true;
    	this.selectedContact = this.emailList[index];
    	this.getProfileData(parseInt(index) + 1);
        if (index != this.selectedIndex) {
            $('.reply-editor').hide();
        }
        this.selectedIndex = index;
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

    onBack(){
        this.isEmailSelected = false;
    }

    showReplyEditor() {
        $('.reply-editor').show();
    }

    searchContact(e) {
        var searchString = this.filterKeyword;

        $(".split-list ul li").each(function(index, value) {
            
            var currentName = $(value).text()
            if( currentName.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
               $(value).show();
            } else {
                $(value).hide();
            }
            
        });
    }

    markAsRead() {
        this.selectedEmail.status = "read";
        $('li.inbox-contact-item-' + this.selectedIndex + ' p.subject').removeClass('unread-subject');
        $('li.inbox-contact-item-' + this.selectedIndex + ' p.body').removeClass('unread-content');

    }

    markAsUnread() {
        this.selectedEmail.status = "unread";
        $('li.inbox-contact-item-' + this.selectedIndex + ' p.subject').addClass('unread-subject');
        $('li.inbox-contact-item-' + this.selectedIndex + ' p.body').addClass('unread-content');
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
}