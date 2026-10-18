import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderActions } from '@core/services/header-actions';
import { Theme } from '@core/services/theme';
import { Button } from '@shared/components/button/button';
import { ChevronLeftIcon } from '@shared/components/chevron-left-icon/chevron-left-icon';
import { PlusIcon } from '@shared/components/plus-icon/plus-icon';

@Component({
  imports: [RouterLink, Button, PlusIcon, ChevronLeftIcon],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  private theme = inject(Theme);
  private headerActions = inject(HeaderActions);

  isLightMode = this.theme.isLightMode;
  showCreateSurveyButton = this.headerActions.showCreateSurveyButton;
  showDetailControls = this.headerActions.showDetailControls;

  /**
   * @description Scrolls smoothly down to the results of the survey. A plain
   * #results link would not work here, because the base href of the page
   * points to the start page.
   * @return {void}
   * @memberof Header
   */
  scrollToResults(): void {
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
  }
}
