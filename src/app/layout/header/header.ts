import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderActions } from '@core/services/header-actions';
import { Theme } from '@core/services/theme';
import { Button } from '@shared/components/button/button';
import { PlusIcon } from '@shared/components/plus-icon/plus-icon';

@Component({
  imports: [RouterLink, Button, PlusIcon],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  private theme = inject(Theme);
  private headerActions = inject(HeaderActions);

  isLightMode = this.theme.isLightMode;
  showCreateSurveyButton = this.headerActions.showCreateSurveyButton;
}
