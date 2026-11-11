import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-public-works',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './public-works.component.html',
  styleUrl: './public-works.component.scss',
})
export class PublicWorksComponent {
  faExternalLinkAlt = faExternalLinkAlt;
}
