import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { GetDataService } from '../../_services/getdata.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as $ from 'jquery';
import { forEach } from '@angular/router/src/utils/collection';

declare let d3: any;
declare var pg: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  options;
  nvd3LineOptions;
  nvd3LineData;
  nvd3LineAreaOptions;
  nvd3LineAreaData;
  myForm: FormGroup;
  fixChart = false;

  data: any;
  tableData = [];

  constructor(private _service: GetDataService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loadStatusData();
    this.initBarChart();
    this.myForm = this.formBuilder.group({
      radio: 'A'
    });
  }

  isLoading:boolean=false;
  errorMessage:boolean=false;
  message:string = "Something went terribly wrong. Just keep calm and carry on!";

  errorCard_isLoading:boolean=false;
  errorCard_errorMessage:boolean=false;
  errorCard_message:string = "Something went terribly wrong.";


  initRealtimeChart() {
    this._service.getChartSampleData().subscribe(d => {
      this.nvd3LineData = d.nvd3.chart;
      this.nvd3LineAreaData = d.nvd3.monthSales;
      this.nvd3LineOptions = {
        chart: {
          type: 'multiBarChart',
          color: [
            'rgb(0,0,0)',
            'rgba(0, 123, 232, 1)',
            'rgb(0,232,21)', //south america

            'rgb(232,15,0)', //europe
            'rgb(112,33,232)', //europe
            'rgba(0,0,0,0.56)', //europe
          ],
          height: 300,
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
        height: 400,
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

  errorCardSampleRefresh(){
    this.errorCard_isLoading = true;
    this.errorCard_errorMessage = false;
    setTimeout(()=>{
          this.errorCard_isLoading = false;
          this.errorCard_errorMessage = true;
    },3000);
  }

  sampleRefresh(){
    this.isLoading = true;
    this.errorMessage = false;
    setTimeout(()=>{
          this.isLoading = false;
          this.errorMessage = true;
    },3000);
  }

  showChart() {
    $('.stats-table').addClass('hidden');
    $('.chart-section').removeClass('hidden');
  }

  showTable() {
    $('.chart-section').addClass('hidden');
    $('.stats-table').removeClass('hidden');
  }

}
