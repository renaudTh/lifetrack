import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { UserService } from '../../../domain/user.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Menubar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private userService = inject(UserService);

  public items: MenuItem[] = [
    

        {
          label: "Profile"
        },
        {
          label: "Logout",
          command: async () => {
            await this.userService.logout();
            
          }
        }
      
    
  ] 
}
