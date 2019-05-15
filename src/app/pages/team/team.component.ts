import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import * as $ from 'jquery';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TeamComponent implements OnInit {

	@ViewChild('mdSlideUp') mdSlideUp: ModalDirective;

	fName;
  	lName;
  	email;
  	aType;

  	teams = [
  		{
  			image: "assets/img/profiles/8.jpg",
	      	name: "alex",
	      	email: "alex@ogmail.com",
	      	status: "active",
	      	teams: ""
  		},
  		{
  			image: "assets/img/profiles/9.jpg",
	      	name: "Gary Egan",
	      	email: "gary.egan@oracle.com",
	      	status: "active",
	      	teams: ""
  		}
  	];

  	accountOptions = [
  		{value: "admin", label: "Admin"},
  		{value: "member", label: "Member"}
  	]

  	statusOptions = [
  		{value: "active", label: "Active"},
  		{value: "inactive", label: "inactive"}
  	]

  	changedStatusValue = null;

	scrollBarHorizontal = (window.innerWidth < 960);
  	columnModeSetting = (window.innerWidth < 960) ? 'standard':'force';

    constructor (
    	private fb: FormBuilder
    	) {
    }



    ngOnInit() {

    }

    addTeam() {
		this.mdSlideUp.show();
	}

	addNewTeam() {
		setTimeout(() => {
			this.mdSlideUp.hide();
		}, 500);
	}

	closeModal() {
		this.mdSlideUp.hide();
	}

    changeStatus(key, event) {
    	var changedOption = event.target.value;
    	$('#status_td_' + key + ' .status .fa-circle').removeClass('status--active');
		$('#status_td_' + key + ' .status .fa-circle').removeClass('status--inactive');
		$('#team_td_' + key + ' .team-image .status .fa-circle').removeClass('status--active');
		$('#team_td_' + key + ' .team-image .status .fa-circle').removeClass('status--inactive');
    	if (changedOption == 'active') {
    		$('#status_td_' + key + ' .status .fa-circle').addClass('status--active');
    		$('#team_td_' + key + ' .team-image .status .fa-circle').addClass('status--active');
    	} else {
    		$('#status_td_' + key + ' .status .fa-circle').addClass('status--inactive');
    		$('#team_td_' + key + ' .team-image .status .fa-circle').addClass('status--inactive');
    	}
    }

}