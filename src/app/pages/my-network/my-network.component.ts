import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';

@Component({
    selector: 'app-my-network',
    templateUrl: './my-network.component.html',
    styleUrls: ['./my-network.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class MyNetworkComponent implements OnInit {
  
    selected = [];
    fileName: string = null;

    @ViewChild('mdSlideUp') mdSlideUp: ModalDirective;

    slideUp: any = {
        type: "md"
    }

    advanceColumns = [{
            prop: 'selected',
            name: '',
            sortable: false,
            canAutoResize: false,
            draggable: false,
            resizable: false,
            headerCheckboxable: true,
            checkboxable: true,
            width: 50
        },
        { name: 'Contact Details' },
        { name: 'Business Email' },
        { name: 'Company Details' },
        { name: 'Actions' },
    ];

    advanceRows = [];

    selectedOptionCS = 'Found 7221 records';
    selectedOptionlist = 'All Lists';
    selectedOptionMore = 'More';
    selectedMoveTo;

    optionsList = [
        { value: "Valid", label: "Valid" },
        { value: "Best Match", label: "Best Match" },
        { value: "Catch All", label: "Catch All" },
        { value: "Unknown", label: "Unknown" },
        { value: "Invalid", label: "Invalid" }
    ]

    moreoptions = [{
            value: '0',
            label: 'More'
        },
        {
            value: 'export',
            label: 'Export'
        },
        {
            value: 'import',
            label: 'Import'
        },
    ]

    csoptions = [{
            value: 'Web-safe',
            label: 'Web-safe'
        },
        {
            value: 'Helvetica',
            label: 'Helvetica'
        },
        {
            value: 'SegeoUI',
            label: 'SegeoUI'
        },
    ];

    scrollBarHorizontal = (window.innerWidth < 960);
    columnModeSetting = (window.innerWidth < 960) ? 'standard' : 'force';

    options = [];

    constructor() {
        this.fetchSampleAdvance((data) => {
            this.advanceRows = data;
        });

        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 960);
            this.columnModeSetting = (window.innerWidth < 960) ? 'standard' : 'force';
        };
    }

    ngOnInit() {
        let that = this;
        $(document)
            .off('mouseenter', '.datatable-row-wrapper')
            .on('mouseenter', '.datatable-row-wrapper', function() {
                $(this).find('.thumbnail-wrapper').addClass('hidden');
                $(this).find('.image-checkbox').removeClass('hidden');
            })

        $(document)
            .off('mouseleave', '.datatable-row-wrapper')
            .on('mouseleave', '.datatable-row-wrapper', function() {
                $(this).find('.image-checkbox').addClass('hidden');
                $(this).find('.thumbnail-wrapper').removeClass('hidden');
            })

    }

    fetchSampleAdvance(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', `assets/data/network.json`);

        req.onload = () => {
            cb(JSON.parse(req.response));
        };

        req.send();
    }

    onSelect(row) {
        this.selected = row.selected;
    }

    onActivate(event) {}

    csSelect(event) {
        let value = event.target.text;
        this.selectedOptionCS = value;
    }

    listSelect(event) {
        let value = event.target.text;
        this.selectedOptionlist = value;
    }

    moreSelect(event) {
        let value = event.target.text;
        this.selectedOptionMore = value;
        if (value == 'Import') {
            this.mdSlideUp.show();
        }
    }

    moveToSelect(event) {
        let value = event.target.text;
        this.selectedMoveTo = value;
    }

    uploadEvent() {
        $('input[type="file"]').click();
    }

    selectFile(event) {
        this.fileName = event.target.files[0].name;
    }

    removeSelectedFile() {
        this.fileName = null;
    }

    uploadFile() {
        setTimeout(() => {
            $('.step-upload-csv').removeClass('current-step').addClass('complete-step');
            $('.step-map-attribute').addClass('current-step');
            $('.upload-csv-section').addClass('hidden');
            $('.map-attributes').removeClass('hidden');
        }, 500);
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

    openEditpage(Id) {
        var url = 'prospector/network/profile/edit/' + Id;
        window.open(url, "_blank");
    }

    openDetailPage(Id) {
        var url = 'prospector/network/profile/' + Id;
        window.open(url, "_blank");
    }

    toogleRecordDropdown(e) {
        var dropdown = $('.found-record-dropdown');
        if ($(dropdown).hasClass('active')) {
            $(dropdown).removeClass('active');
        } else {
            $(dropdown).addClass('active');
        }
    }
}