import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GetDataService {

  constructor(private http: Http) { }

  // Get all data from the API
  getChartSampleData() {
    return this.http.get('assets/data/dashboard.json')
      .map(res => res.json());
  }

  getNetworkProfileData() {
      return this.http.get('assets/data/network.json')
      .map(res => res.json());
  }

  getEmails() {
    return this.http.get('assets/data/preview-message.json')
      .map(res => res.json());
  }

  getCampaignData() {
    return this.http.get('assets/data/campaign.json')
      .map(res => res.json());
  }

  getActivities() {
    return this.http.get('assets/data/activities.json')
      .map(res => res.json());
  }

  getTimezones() {
    return this.http.get('assets/data/timezone.json')
      .map(res => res.json());
  }

  getEmailTemplates() {
    return this.http.get('assets/data/email-template.json')
      .map(res => res.json());
  }
}