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
      title: "📊 Dashboard Overview",
      icon: "fas fa-tachometer-alt",
      intro: "Understand your key performance indicators at a glance.",
      points: [
        "<strong>Key Metrics:</strong> The top cards show your total balance, active samples, and pending tasks.",
        "<strong>Charts:</strong> Visual graphs help you track testing volume and revenue trends over time.",
        "<strong>Quick Actions:</strong> Use the dashboard shortcuts to quickly navigate to common tasks like 'New Test' or 'New Client'.",
        "<strong>Notifications:</strong> Recent alerts and system updates are displayed in the activity feed."
      ],
      open: true
    },
    {
      title: "👥 Managing Clients",
      icon: "fas fa-users",
      intro: "Efficiently manage your client database.",
      points: [
        "<strong>View Clients:</strong> Navigate to the 'Clients' section in the sidebar to see a full list of your registered clients.",
        "<strong>New Client:</strong> Click the <span class='badge bg-primary'>New</span> button to open the registration form. Fill in the details and click 'Save'.",
        "<strong>Search:</strong> Use the search bar at the top to quickly find clients by name or code.",
        "<strong>View Details:</strong> Click the <i class='fas fa-eye text-primary'></i> (Eye) icon to see a comprehensive read-only view of client data.",
        "<strong>Update Client:</strong> Click the <i class='fas fa-edit text-success'></i> (Edit) icon next to a client to modify their information.",
        "<strong>Delete Client:</strong> Click the <i class='fas fa-trash text-danger'></i> (Trash) icon to remove a client. Confirm the action in the popup."
      ],
      open: false
    },
    {
      title: "🏗️ Managing Projects",
      icon: "fas fa-project-diagram",
      intro: "Keep track of all ongoing and completed projects.",
      points: [
        "<strong>View Projects:</strong> Access the 'Projects' section to view all projects associated with your clients.",
        "<strong>New Project:</strong> Click <span class='badge bg-primary'>New</span> to Create a new project. You'll need to select an existing Client Code.",
        "<strong>Search:</strong> Filter projects instantly using the search functionality to find specific sites or owners.",
        "<strong>Update Project:</strong> Use the <i class='fas fa-edit text-success'></i> icon to edit project details like Consultant, Owner, or Location.",
        "<strong>Delete Project:</strong> Remove a project safely using the <i class='fas fa-trash text-danger'></i> icon."
      ],
      open: false
    },
    {
      title: "🧪 Managing Tests",
      icon: "fas fa-flask",
      intro: "Handle laboratory tests and technical reports.",
      points: [
        "<strong>Test Types:</strong> The system supports various tests including Asphalt, Concrete, Soil (Atterberg, Sand, etc.), and more.",
        "<strong>New Test:</strong> Click <span class='badge bg-primary'>New</span> to record a new test entry. Select the relevant Project and Test Manager.",
        "<strong>Update Test:</strong> Modify test parameters or status using the <i class='fas fa-edit text-success'></i> icon.",
        "<strong>View Trials:</strong> Click the <i class='fas fa-eye text-primary'></i> (Eye) icon (or 'View Trails' button) to manage individual sample trials and results.",
        "<strong>Delete Test:</strong> Use the <i class='fas fa-trash text-danger'></i> icon to delete a test record if necessary.",
        "<strong>Active Status:</strong> Toggle the 'Active' status to enable or disable specific tests."
      ],
      open: false
    },
    {
      title: "📉 Analysis & Reports",
      icon: "fas fa-chart-line",
      intro: "Deep dive into specific lab analyses.",
      points: [
        "<strong>Trials List:</strong> Within a specific test type (e.g., Asphalt), you view a list of all trials cards.",
        "<strong>New Trial:</strong> Use the 'New Trial' button to add a specific sample result.",
        "<strong>Workflow:</strong> Move trials through stages: <span class='badge bg-warning text-dark'>Pending</span> &rarr; <span class='badge bg-info'>Adopted</span> &rarr; <span class='badge bg-success'>Approved</span>.",
        "<strong>Reports:</strong> Generate PDF reports for individual trials or summary reports for the entire project."
      ],
      open: false
    },
    {
      title: "⚙️ System Settings",
      icon: "fas fa-cogs",
      intro: "Configure the application to your needs.",
      points: [
        "<strong>User Management:</strong> (Admins Only) Add, edit, or remove system users and assign roles (Manager, Tech, Quality, etc.).",
        "<strong>Test Manager:</strong> Configure global parameters for different test types.",
        "<strong>Database Backup:</strong> Create manual backups of your data or restore from a previous point to ensure data safety."
      ],
      open: false
    },
    {
      title: "👤 Account & Profile",
      icon: "fas fa-user-circle",
      intro: "Manage your personal account settings.",
      points: [
        "<strong>Profile:</strong> View and update your personal details, job title, and contact info.",
        "<strong>Avatar:</strong> Upload a professional profile picture.",
        "<strong>Security:</strong> Change your password securely from the profile page.",
        "<strong>Notifications:</strong> Check the notification bell in the navbar for important alerts and updates."
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
