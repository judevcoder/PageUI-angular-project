import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutes } from './pages.routing.module';

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

import { NgxEchartsModule } from 'ngx-echarts';
import { NvD3Module } from 'ngx-nvd3';
import { TabsModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap';

import { pgTabsModule } from '../@pages/components/tabs/tabs.module';
import { pgCardModule } from '../@pages/components/card/card.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../@pages/components/shared.module';
import { pgSelectModule} from '../@pages/components/select/select.module';
import { pgTagModule } from '../@pages/components/tag/tag.module';
import { pgSwitchModule } from '../@pages/components/switch/switch.module';
import { pgTimePickerModule } from '../@pages/components/time-picker/timepicker.module';
import { pgSelectfx } from '../@pages/components/cs-select/select.module';
import { pgDatePickerModule } from '../@pages/components/datepicker/datepicker.module';
import { pgUploadModule } from '../@pages/components/upload/upload.module';
import { TextMaskModule } from 'angular2-text-mask';
import { QuillModule } from 'ngx-quill'
import { OrdinalSuffPipe } from '../pipes/ordinalsuff.pipe';
import { MessageModule } from '../@pages/components/message/message.module';
import { MessageService } from '../@pages/components/message/message.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(PagesRoutes),
        NgxEchartsModule,
        NvD3Module,
        pgTabsModule,
        pgCardModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonsModule,
        SharedModule,
        NgxDatatableModule,
        pgSelectModule,
        pgTagModule,
        pgSwitchModule,
        pgTimePickerModule,
        pgSelectfx,
        pgDatePickerModule,
        pgUploadModule,
        TabsModule,
        TypeaheadModule,
        TextMaskModule,
        QuillModule,
        BsDropdownModule,
        ModalModule,
        MessageModule
    ],
    declarations: [
        BillingComponent,
        CampaignComponent,
        CampaignDetailComponent,
        CampaignSetupComponent,
        EditCampaignComponent,
        DashboardComponent,
        EmailFinderComponent,
        EmailSettingsComponent,
        InboxComponent,
        IntegrationsComponent,
        MyNetworkComponent,
        NetworkProfileComponent,
        NotificationComponent,
        ProfileComponent,
        SettingsComponent,
        TeamComponent,
        OrdinalSuffPipe
    ],
    providers: [MessageService]
})
export class PagesModule { }
