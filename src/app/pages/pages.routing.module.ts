import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { CampaignSetupComponent } from './campaign-setup/campaign-setup.component';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmailFinderComponent } from './email-finder/email-finder.component';
import { EmailSettingsComponent } from './email-settings/email-settings.component';
import { InboxComponent } from './inbox/inbox.component';
import { IntegrationsComponent } from './integrations/integrations.component';
import { MyNetworkComponent } from './my-network/my-network.component';
import { NetworkProfileComponent } from './network-profile/network-profile.component';
import { NotificationComponent } from './notification/notification.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { TeamComponent } from './team/team.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
	    {path: '', redirectTo: 'dashboard', pathMatch: 'prefix'},
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'prospector/network',
        component: MyNetworkComponent,
        data: {
          title: 'My Network'
        }
      },
      {
        path: 'prospector/network/profile/:id',
        component: NetworkProfileComponent,
        data: {
          title: 'Network Profile Detail'
        }
      },
      {
        path: 'prospector/network/profile/edit/:id',
        component: NetworkProfileComponent,
        data: {
          title: 'Network Profile Edit'
        }
      },
      {
        path: 'prospector/email-finder',
        component: EmailFinderComponent,
        data: {
          title: 'Fine Email'
        }
      },
      {
        path: 'emailer/campaign',
        component: CampaignComponent,
        data: {
          title: 'Campaign'
        }
      },
      {
        path: 'emailer/campaign-setup',
        component: CampaignSetupComponent,
        data: {
          title: 'Campaign Setup'
        }
      },
      {
        path: 'emailer/campaign/detail/:id',
        component: CampaignDetailComponent,
        data: {
          title: 'Campaign Detail'
        }
      },
      {
        path: 'emailer/campaign/edit/:id',
        component: EditCampaignComponent,
        data: {
          title: 'Campaign Detail'
        }
      },
      {
        path: 'emailer/inbox',
        component: InboxComponent,
        data: {
          title: 'Inbox'
        }
      },
      {
        path: 'emailer/email-settings',
        component: EmailSettingsComponent,
        data: {
          title: 'Email Settings'
        }
      },
      {
        path: 'account/profile',
        component: ProfileComponent,
        data: {
          title: 'Account Profile'
        }
      },
      {
        path: 'account/team',
        component: TeamComponent,
        data: {
          title: 'Account Team'
        }
      },
      {
        path: 'account/billing',
        component: BillingComponent,
        data: {
          title: 'Account Billing'
        }
      },
      {
        path: 'account/integration',
        component: IntegrationsComponent,
        data: {
          title: 'Integrations'
        }
      },
      {
        path: 'account/settings',
        component: SettingsComponent,
        data: {
          title: 'Account Settings'
        }
      },
      {
        path: 'account/notification',
        component: NotificationComponent,
        data: {
          title: 'Notification'
        }
      }
    ]
  }
];
