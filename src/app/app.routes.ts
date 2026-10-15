import { Routes } from '@angular/router';
import { Home } from '@survey/pages/home/home';
import { CreateSurvey } from '@survey/pages/create-survey/create-survey';
import { SurveyDetail } from '@survey/pages/survey-detail/survey-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'survey/:id', component: SurveyDetail },
  { path: 'create-survey', component: CreateSurvey },
];
