import { Component, OnInit } from '@angular/core';
import { Book, IStudent } from 'src/app/modal/modal';
import { BooksService } from 'src/app/services/books.service';
import { Label } from 'ng2-charts';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  bookResult: Book[] = [];
  studentResult: IStudent[] = [];
  books = true;
  students = false;

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [],
      label: 'Requested Times',
      backgroundColor:
        ['rgba(255, 97, 97, 0.33)', 'rgba(255, 97, 186, 0.33)', 'rgba(234, 97, 255, 0.33)',
          'rgba(142, 97, 255, 0.33)', 'rgba(97, 126, 255, 0.33)', 'rgba(97, 221, 255, 0.33)',
          'rgba(43, 227, 157, 0.33)', 'rgba(46, 227, 43, 0.33)', 'rgba(255, 189, 97, 0.33)',
          'rgba(255, 102, 97, 0.33)'
        ],
      borderColor:
        ['rgba(255, 97, 97)', 'rgba(255, 97, 186)', 'rgba(234, 97, 255)', 'rgba(142, 97, 255)',
          'rgba(97, 126, 255)', 'rgba(97, 221, 255)', 'rgba(43, 227, 157)', 'rgba(46, 227, 43)',
          'rgba(255, 189, 97)', 'rgba(255, 102, 97)'
        ],
      hoverBackgroundColor:
        ['rgba(255, 97, 97)', 'rgba(255, 97, 186)', 'rgba(234, 97, 255)', 'rgba(142, 97, 255)',
          'rgba(97, 126, 255)', 'rgba(97, 221, 255)', 'rgba(43, 227, 157)', 'rgba(46, 227, 43)',
          'rgba(255, 189, 97)', 'rgba(255, 102, 97)'
        ],
      hoverBorderColor:
        ['rgba(255, 97, 97)', 'rgba(255, 97, 186)', 'rgba(234, 97, 255)', 'rgba(142, 97, 255)',
          'rgba(97, 126, 255)', 'rgba(97, 221, 255)', 'rgba(43, 227, 157)', 'rgba(46, 227, 43)',
          'rgba(255, 189, 97)', 'rgba(255, 102, 97)'
        ],
      fill: false,
      borderWidth: 1
      }
  ];

  public barChartOptions: ChartOptions = {
    legend: {
      labels: {
        fontColor: 'black'
      }
    },
    tooltips: {
      enabled: true,
      titleFontSize: 14,
      titleFontStyle: 'normal',
      bodyFontSize: 14,
      bodySpacing: 0,
      callbacks: {
        title: (tooltipItem, data) => {
          const typeArr = tooltipItem[0].label.split('(');
          if (typeArr[1] === 'book') {
            const infoArr = typeArr[0].split('*');
            return [`Title: ${infoArr[0]}`, `Author: ${infoArr[1]} ${infoArr[2]}`, `Genre: ${infoArr[3]}`, `Publisher: ${infoArr[4]}`];
          }
          else if (typeArr[1] === 'student') {
            const studentInfoArr = typeArr[0].split('*');
            return [`Name: ${studentInfoArr[0]} ${studentInfoArr[1]}`, `Email: ${studentInfoArr[2]}`];
          }
        }
      }
    },
    responsive: true,
    aspectRatio: 2,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        ticks: {
          fontColor: 'black',
          fontFamily: 'Noto Sans',
          fontSize: 14,
        }
      }],
      yAxes: [{
        ticks:{
          fontColor: 'black',
          fontFamily: 'Noto Sans',
          fontSize: 14,
          callback: (value) => {
            const typeArr = value.toString().split('(');
            if (typeArr[1] === 'book') {
              const title = value.toString().split('*');
              return title[0];
            }
            else if (typeArr[1] === 'student'){
              const userArr = value.toString().split('*');
              return `${userArr[0]} ${userArr[1]}`;
            }
          }
        }
      }]
    },
    // We use these empty structures as placeholders for dynamic theming.
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'black'
      }
    }
  };

  constructor(private booksService: BooksService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.getBooks();
    this.getStudents();
    this.barChartData[0].label = 'Requested Times';
  }

  changeBooks(){
    this.books = true;
    this.students = false;
    this.barChartLabels = [];
    this.barChartData[0].data = [];
    for (let i = 0; i < 10; i++) {
      const label = `${this.bookResult[i].title}*${this.bookResult[i].authorFirstName}*${this.bookResult[i].authorLastName}*${this.bookResult[i].genre}*${this.bookResult[i].publisher}(book`;
      this.barChartLabels.push(label);
      this.barChartData[0].data.push(this.bookResult[i].requested_times);
    }
    this.barChartData[0].label = 'Requested Times';
  }

  changeStudents(){
    this.books = false;
    this.students = true;
    this.barChartLabels = [];
    this.barChartData[0].data = [];
    for (let i = 0; i < 10; i++) {
      const label = `${this.studentResult[i].first_name}*${this.studentResult[i].last_name}*${this.studentResult[i].email}(student`;
      this.barChartLabels.push(label);
      this.barChartData[0].data.push(this.studentResult[i].requested_books);
    }
    this.barChartData[0].label = 'Requested Books';
  }

  getBooks(){
    this.booksService.getInfo().subscribe({
      next: data => {
        this.bookResult =
          data.sort((a, b) => (a.requested_times > b.requested_times) ? -1 : (b.requested_times > a.requested_times) ? 1 : 0);
        for (let i = 0; i < 10; i++) {
          const label = `${this.bookResult[i].title}*${this.bookResult[i].authorFirstName}*${this.bookResult[i].authorLastName}*${this.bookResult[i].genre}*${this.bookResult[i].publisher}(book`;
          this.barChartLabels.push(label);
          this.barChartData[0].data.push(this.bookResult[i].requested_times);
        }
      },
      error: err => console.log(err)
    });
  }

  getStudents(){
    this.usersService.getInfo().subscribe({
      next: data => {
        this.studentResult =
          data.sort((a, b) => (a.requested_books > b.requested_books) ? -1 : (b.requested_books > a.requested_books) ? 1 : 0);
      },
      error: err => console.log(err)
    });
  }

}
