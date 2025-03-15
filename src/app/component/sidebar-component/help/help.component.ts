import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent {
  helpTopics = [
    {
      title: "🔍 Navigation",
      points: [
        "Use the sidebar to access different sections.",
        "The navbar contains quick actions like profile and settings.",
        "Click on the dashboard to view an overview of activities."
      ],
      open: false
    },
    {
      title: "📝 Managing Clients",
      points: [
        "Click 'New Client' to add a client (Admin only).",
        "Use the search bar to filter clients quickly.",
        "Click a client's name to view their profile and history."
      ],
      open: false
    },
    {
      title: "📦 Orders & Billing",
      points: [
        "Navigate to 'Orders' to view and manage transactions.",
        "Use the 'Invoice' section to generate billing statements.",
        "Apply discounts and taxes from the settings panel."
      ],
      open: false
    },
    {
      title: "⚙️ Settings & Preferences",
      points: [
        "Go to 'Settings' to customize themes and notifications.",
        "Enable two-factor authentication for security.",
        "Manage user roles and permissions under 'User Management'."
      ],
      open: false
    }
  ];

  toggleSection(section: any) {
    section.open = !section.open;
  }
}
