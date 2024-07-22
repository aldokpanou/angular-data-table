import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { datas } from '../../data';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {
  datas: any[] = datas;
  isDropdownOpen = false;
  sortCriteria: string = 'default'; // Critère de tri par défaut
  sortDirection: 'asc' | 'desc' = 'asc'; // Direction de tri par défaut
  searchTerm = new FormControl('');
  currentPage: number = 1;
  pageSize: number = 5;
  filterStatus: string = 'all'; // Filtre de statut par défaut

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit() {
    this.loadData();
  
    // Abonner aux changements dans le champ de recherche
    this.searchTerm.valueChanges.subscribe(() => {
      this.updateData();
    });
  }

  loadData() {
    this.datas = datas;
    this.updateData();
  }

  // Trier selon le critère sélectionné
  sortBy(criteria: string) {
    this.sortCriteria = criteria;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'; // Inverser la direction du tri
  
    this.datas.sort((a, b) => {
      // Extraire le prénom et le nom de famille en séparant le champ 'name'
      const [firstNameA, lastNameA] = (a.name ?? '').split(' ');
      const [firstNameB, lastNameB] = (b.name ?? '').split(' ');
  
      let valA: string | number = '';
      let valB: string | number = '';
  
      // Choisir les valeurs à comparer en fonction du critère de tri
      if (this.sortCriteria === 'firstName') {
        valA = firstNameA ?? '';
        valB = firstNameB ?? '';
      } else if (this.sortCriteria === 'lastName') {
        valA = lastNameA ?? '';
        valB = lastNameB ?? '';
      } else {
        // Par défaut, trier par le nom complet (si nécessaire)
        valA = a.name ?? '';
        valB = b.name ?? '';
      }
  
      // Comparer les valeurs en fonction de la direction de tri
      if (valA < valB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  
    this.updateData();
    this.isDropdownOpen = false;
  }
  
  // Filtrer les utilisateurs selon le filtre sélectionné
  filterUsers(filter: string) {
    this.filterStatus = filter;
    this.currentPage = 1; // Réinitialiser à la première page quand le filtre change
    this.updateData();
    this.isDropdownOpen = false;
  }

  setFilterStatus(status: string) {
    console.log(status);
    
    this.filterStatus = status;
    this.currentPage = 1; // Réinitialiser à la première page quand le statut du filtre change
    this.updateData();
  }  

  // Filtrer et paginer les données
  filteredData() {
    const term = this.searchTerm.value?.toLowerCase() || '';
    const filtered = this.datas
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(term) || item.email.toLowerCase().includes(term);
        const matchesStatus = 
          this.filterStatus === 'all' || 
          (this.filterStatus === 'paid' && item.paymentStatus === 'Paid') || 
          (this.filterStatus === 'active' && item.status === 'Active') || 
          (this.filterStatus === 'inactive' && item.status === 'Inactive')||
          (this.filterStatus === 'pending' && item.paymentStatus === 'Pending')||
          (this.filterStatus === 'overdue' && item.paymentStatus === 'Overdue');
        return matchesSearch && matchesStatus;
      });
  
    // Paginer les données filtrées
    return filtered.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }

  filteredDataForCurrentPage: any[] = [];

  // Mettre à jour les données pour refléter les filtres et le tri actuels
  updateData() {
    // Calculer les données filtrées et paginées
    this.filteredDataForCurrentPage = this.filteredData();
  }

  // Passer à la page suivante
  nextPage() {
    if ((this.currentPage * this.pageSize) < this.datas.length) {
      this.currentPage++;
      this.updateData();
    }
  }

  // Revenir à la page précédente
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateData();
    }
  }

  // Mettre à jour la taille de la page et réinitialiser à la première page
  updatePageSize(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = +selectElement.value;
    this.currentPage = 1; // Réinitialiser à la première page quand la taille de la page change
    this.updateData();
  }

  // Basculer la visibilité de la description d'une commande
  toggleDescription(orderId: number): void {
    const order = this.datas.find(o => o.id === orderId);
    if (order) {
      order.showDescription = !order.showDescription;
    }
  }
}
