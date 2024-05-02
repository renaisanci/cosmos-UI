import { Component } from '@angular/core';
import { SchemaService } from '../../services/schema.service';

@Component({
  selector: 'driver-selector',
  templateUrl: './driver-selector.component.html',
  styleUrls: ['./driver-selector.component.css']
})
export class DriverSelectorComponent {
  drivers: string[] = [];
  selectedDriver: string | null = null;
  driverOptions: { name: string, description: string, defaultValue: string }[] = [];

  constructor(private schemaService: SchemaService) {
    this.loadDrivers();
  }

  private loadDrivers(): void {
    this.drivers = Array.from(this.schemaService.getAllDriverTypes());
  }

  showDriverOptions(driver: string): void {
    this.selectedDriver = driver;
    const schema = this.schemaService.getDriverSchema(driver);
    if (schema) {
      this.driverOptions = this.extractOptionsFromSchema(schema);
    } else {
      this.driverOptions = [];
    }
  }

  private extractOptionsFromSchema(schema: string): { name: string, description: string, defaultValue: string }[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(schema, 'text/xml');
    const options = Array.from(xmlDoc.getElementsByTagName('Option'));
    return options.map(option => {
        return {
            name: option.getAttribute('Name') || '',
            description: option.getAttribute('Description') || '',
            defaultValue: option.getAttribute('DefaultValue') || ''
        };
    });
  }
}
