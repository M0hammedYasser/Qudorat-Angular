import { Component } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";

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
      title: "👥 Managing Clients",
      icon: "fas fa-users",
      intro: "Efficiently manage your client database.",
      points: [
        "<strong>View Clients:</strong> Navigate to the 'Clients' section in the sidebar to see a full list of your registered clients.",
        "<strong>New Client:</strong> Click the <span class='badge bg-primary'>New</span> button to open the registration form. Fill in the details and click 'Save'.",
        "<strong>Search:</strong> Use the search bar at the top to quickly find clients by name or code.",
        "<strong>Update Client:</strong> Click the <i class='fas fa-edit text-success'></i> (Edit) icon next to a client to modify their information.",
        "<strong>Delete Client:</strong> Click the <i class='fas fa-trash text-danger'></i> (Trash) icon to remove a client. Confim the action in the popup."
      ],
      open: true
    },
    {
      title: "🏗️ Managing Projects",
      icon: "fas fa-project-diagram",
      intro: "Keep track of all ongoing and completed projects.",
      points: [
        "<strong>View Projects:</strong> Access the 'Projects' section to view all projects associated with your clients.",
        "<strong>New Project:</strong> Click <span class='badge bg-primary'>New</span> to Create a new project. You'll need to select an existing Client Code.",
        "<strong>Search:</strong> Filter projects instantly using the search functionality.",
        "<strong>Update Project:</strong> Use the <i class='fas fa-edit text-success'></i> icon to edit project details like Consultnt, Owner, or Location.",
        "<strong>Delete Project:</strong> Remove a project safely using the <i class='fas fa-trash text-danger'></i> icon."
      ],
      open: false
    },
    {
      title: "🧪 Managing Tests",
      icon: "fas fa-flask",
      intro: "Handle laboratory tests and technical reports.",
      points: [
        "<strong>View Tests:</strong> The 'Tests' section lists all technical tests (Soil, Asphalt, Concrete etc).",
        "<strong>New Test:</strong> Click <span class='badge bg-primary'>New</span> to record a new test entry. Select Project and Test Manager.",
        "<strong>Update Test:</strong> Modify test parameters or status using the <i class='fas fa-edit text-success'></i> icon.",
        "<strong>View Trails:</strong> Click the <i class='fas fa-eye text-primary'></i> (Eye) icon to see detailed trails and results for a specific test.",
        "<strong>Delete Test:</strong> Use the <i class='fas fa-trash text-danger'></i> icon to delete a test record if necessary.",
        "<strong>Active Status:</strong> Toggle the 'Active' status to enable or disable specific tests."
      ],
      open: false
    }
  ];

  toggleSection(section: any) {
    // Optional: close others when one opens (Accordion style)
    // this.helpTopics.forEach(t => { if(t !== section) t.open = false; });
    section.open = !section.open;
  }
}
