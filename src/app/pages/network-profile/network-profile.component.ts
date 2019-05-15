import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDataService } from '../../_services/getdata.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-network-profile',
    templateUrl: './network-profile.component.html',
    styleUrls: ['./network-profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NetworkProfileComponent implements OnInit {

    @ViewChild('NotesModal') NotesModal: ModalDirective;
    @ViewChild('TagModal') TagModal: ModalDirective;

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
            earned: 182795000000
        },
        city: "Cupertino",
        phone: "(408) 996-1010",
        address: "One Infinite Loop Cupertino Califonia 95014 United States"
    };
    
    options = [
        { value: 'opened', label: 'Opened' },
        { value: 'sent', label: 'Sent' },
        { value: 'received', label: 'Received' },
    ];

    disabled: boolean = true;

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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private getdataservice: GetDataService
    ) {}

    ngOnInit() {
        let itemName = this.route.snapshot.params['id'];
        this.getProfileData(itemName);
    }

    getProfileData(id) {
        this.getdataservice.getNetworkProfileData().subscribe(res => {
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
            this.profileData['companyDetails']['contactCount'] = profile[0]['companyDetails']['contactCount'];
            this.profileData['companyDetails']['foundDate'] = profile[0]['companyDetails']['foundDate'];
            this.profileData['companyDetails']['earned'] = this.numberWithCommas(profile[0]['companyDetails']['earned']);
        })
    }

    private numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    editableProfileInfo() {
        if (this.disabled) {
            this.disabled = false;
        } else {
            this.disabled = true;
        }
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

    hideNotes() {
        this.hideNote = false;
        this.showMore = true;
    }

    showAllNotes() {
        this.showMore = false;
        this.hideNote = true;
    }

}