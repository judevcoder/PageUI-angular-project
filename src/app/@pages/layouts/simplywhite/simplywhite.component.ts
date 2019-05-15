import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RootLayout} from '../root/root.component';
import * as $ from 'jquery';

@Component({
  selector: 'simplywhite-layout',
  templateUrl: './simplywhite.component.html',
  styleUrls: ['./simplywhite.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SimplyWhiteLayout extends RootLayout implements OnInit {
  menuLinks = [
    {
      label: 'Dashboard',
      routerLink: '/dashboard',
      iconType: 'fi',
      iconName: 'airplay',
    },
    {
      label: 'Prospector',
      iconType: 'fi',
      iconName: 'users',
      toggle: 'close',
      submenu: [
        {
          label: 'My Network',
          routerLink: '/prospector/network',

        },
        {
          label: 'Email Finder',
          routerLink: '/prospector/email-finder',

        }
      ]
    },    {
      label: 'eMailer',
      iconType:'fi',
      iconName:'mail',
      toggle: 'close',
      submenu: [
        {
          label: 'My Campaigns',
          routerLink: '/emailer/campaign',

        },
        {
          label: 'Inbox',
          routerLink: '/emailer/inbox',

        },
        {
          label: 'Email Settings',
          routerLink: '/emailer/email-settings',

        }
      ]
    }, {
      label: 'My Account',
      iconType: 'fi',
      iconName: 'briefcase',
      toggle: 'close',
      submenu: [
        {
          label: 'Profile',
          routerLink: '/account/profile',

        },
        {
          label: 'Team',
          routerLink: '/account/team',

        },
        {
          label: 'Billing',
          routerLink: '/account/billing',

        },
        {
          label: 'Integrations',
          routerLink: '/account/integration',

        }
      ]
    },
  ];

  ngOnInit() {
    this.changeLayout('menu-pin');
    //Will sidebar close on screens below 1024
    this.autoHideMenuPin();

    $(document).ready(function() {
      setTimeout(() => {
        $('.notification-panel ul.nav-tabs .active-bar').css('width', '93px');
      }, 500);
    })

    $(document).mouseup(function(e){
      var container = $(".notification-popup");

      // If the target of the click isn't the container
      if(!container.is(e.target) && container.has(e.target).length === 0 && container.hasClass('active') && e.target.id != 'notification-center'){
        container.removeClass('active');
      }
    });
  }

  toogleNotification() {
    if ($('.notification-popup').hasClass('active')) {
      $('.notification-popup').removeClass('active');
    } else {
      $('.notification-popup').addClass('active');
    }
  }

  viewNotification(e) {
    var targetEle = e.target.parentElement.closest('.heading')
    if ($(targetEle).hasClass('open')) {
      $(targetEle).removeClass('open');
      $(targetEle).find('.more-details').hide();
    } else {
      $(targetEle).addClass('open');
      $(targetEle).find('.more-details').show();
    }
  }

}
