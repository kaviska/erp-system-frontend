import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces for datatable configuration
export interface DatatableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  type?: 'text' | 'email' | 'badge' | 'date' | 'currency' | 'number' | 'link' | 'custom';
  badgeClass?: string;
  format?: (value: any) => string;
  template?: string;
  customTemplate?: string; // Add this property for custom templates
  align?: 'left' | 'center' | 'right';
}

export interface DatatableAction {
  label: string;
  icon?: string;
  class?: string;
  action: (row: any) => void;
  visible?: (row: any) => boolean;
}

export interface ExportOption {
  label: string;
  type: 'copy' | 'excel' | 'csv' | 'pdf';
  icon?: string;
}

export interface DatatableConfig {
  searchPlaceholder?: string;
  showSearch?: boolean;
  showExport?: boolean;
  pageSize?: number;
  showPagination?: boolean;
  exportOptions?: ExportOption[];
  customButtons?: DatatableAction[];
}

@Component({
  selector: 'app-datatable',
  imports: [CommonModule, FormsModule],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.css'
})
export class DatatableComponent implements OnInit, OnChanges {
  @Input() title: string = 'Data Table';
  @Input() columns: DatatableColumn[] = [];
  @Input() data: any[] = [];
  @Input() config: DatatableConfig = {};
  @Input() actions: DatatableAction[] = [];
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() export = new EventEmitter<{type: string, data: any[]}>();
  @Output() customAction = new EventEmitter<{action: string, row: any}>();

  // Expose Math object to template
  Math = Math;

  // Component state
  filteredData: any[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  pageSize: number = 10;
  showExportMenu: boolean = false;

  // Default configuration
  defaultConfig: DatatableConfig = {
    searchPlaceholder: 'Search...',
    showSearch: true,
    showExport: true,
    pageSize: 10,
    showPagination: true,
    exportOptions: [
      { label: 'Copy to clipboard', type: 'copy', icon: 'ki-copy' },
      { label: 'Export as Excel', type: 'excel', icon: 'ki-file-down' },
      { label: 'Export as CSV', type: 'csv', icon: 'ki-file-down' },
      { label: 'Export as PDF', type: 'pdf', icon: 'ki-file-down' }
    ],
    customButtons: []
  };

  ngOnInit() {
    this.config = { ...this.defaultConfig, ...this.config };
    this.pageSize = this.config.pageSize || 10;
    this.filteredData = [...this.data];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.filteredData = [...this.data];
      this.applyFilters();
    }
  }

  // Search functionality
  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Sorting functionality
  onSort(column: DatatableColumn) {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }
    
    this.applyFilters();
  }

  // Apply filters (search + sort)
  private applyFilters() {
    let filtered = [...this.data];

    // Search filter
    if (this.searchTerm) {
      const searchableColumns = this.columns.filter(col => col.searchable !== false);
      filtered = filtered.filter(row => {
        return searchableColumns.some(col => {
          const value = this.getNestedValue(row, col.key);
          return value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
        });
      });
    }

    // Sort
    if (this.sortColumn) {
      filtered.sort((a, b) => {
        const aVal = this.getNestedValue(a, this.sortColumn);
        const bVal = this.getNestedValue(b, this.sortColumn);
        
        let comparison = 0;
        if (aVal > bVal) comparison = 1;
        else if (aVal < bVal) comparison = -1;
        
        return this.sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    this.filteredData = filtered;
  }

  // Get nested object value by key path
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }

  // Format cell value based on column type
  formatCellValue(row: any, column: DatatableColumn): string {
    const value = this.getNestedValue(row, column.key);
    
    if (column.format) {
      return column.format(value);
    }

    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value || 0);
      case 'number':
        return new Intl.NumberFormat().format(value || 0);
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '';
      default:
        return value?.toString() || '';
    }
  }

  // Get badge class for badge type columns
  getBadgeClass(row: any, column: DatatableColumn): string {
    const value = this.getNestedValue(row, column.key);
    return column.badgeClass || this.getDefaultBadgeClass(value);
  }

  private getDefaultBadgeClass(value: string): string {
    const lowerValue = value?.toLowerCase();
    if (lowerValue?.includes('active')) return 'badge-light-success';
    if (lowerValue?.includes('inactive')) return 'badge-light-danger';
    if (lowerValue?.includes('pending')) return 'badge-light-warning';
    return 'badge-light-primary';
  }

  // Pagination
  get paginatedData() {
    if (!this.config.showPagination) return this.filteredData;
    
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredData.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  // Export functionality
  onExport(type: string) {
    this.export.emit({ type, data: this.filteredData });
    this.showExportMenu = false;
  }

  // Row click
  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

  // Action button click
  onActionClick(action: DatatableAction, row: any) {
    if (action.action) {
      action.action(row);
    }
    this.customAction.emit({ action: action.label, row });
  }

  // Check if action is visible
  isActionVisible(action: DatatableAction, row: any): boolean {
    return action.visible ? action.visible(row) : true;
  }

  toggleExportMenu() {
    this.showExportMenu = !this.showExportMenu;
  }

  // Get column CSS class
  getColumnClass(column: DatatableColumn): string {
    let cssClass = '';
    
    switch (column.align) {
      case 'center':
        cssClass += 'text-center';
        break;
      case 'right':
        cssClass += 'text-end';
        break;
      default:
        cssClass += 'text-start';
    }
    
    return cssClass;
  }

  // Get column value for display
  getColumnValue(row: any, column: DatatableColumn): any {
    return this.getNestedValue(row, column.key);
  }

  // Method to get custom template (placeholder for now)
  getCustomTemplate(templateName: string): any {
    // This would be used to get ng-template references
    // For now, return null as we'll handle it in the parent component
    return null;
  }

  // Track by function for *ngFor performance
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
