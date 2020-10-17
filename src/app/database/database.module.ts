import { NgModule, APP_INITIALIZER } from '@angular/core';
import { DatabaseProvider } from './database.provider';

function AppInitializer(dbProvider: DatabaseProvider) {
    return () => dbProvider.create();
}

@NgModule({
    declarations: [],
    entryComponents: [],
    imports: [],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: AppInitializer,
            deps: [DatabaseProvider],
            multi: true,
        },
        DatabaseProvider,
    ],
    bootstrap: [],
})
export class DatabaseModule {}
