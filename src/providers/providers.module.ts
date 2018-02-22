import { NgModule } from '@angular/core';
import { AuthService } from './authService.provider';
import { LocationService } from './locationService.provider';
import { PropertyService} from './property-service-mock';
import { MapboxService} from './mapboxService.provider';

@NgModule({
    declarations: [
    
    ],
    providers: [
        AuthService,
        PropertyService,
        LocationService,
        MapboxService
    ]
})
export class ProvidersModule {}
