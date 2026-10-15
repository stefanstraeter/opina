import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SurveysOverview } from '@survey/components/surveys-overview/surveys-overview';
import { Button } from '@shared/components/button/button';

@Component({
  imports: [Button, SurveysOverview, RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
