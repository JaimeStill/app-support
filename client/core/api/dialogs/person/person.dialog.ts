import {
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
    Component,
    Inject,OnInit
} from '@angular/core';

import { Person } from '../../models';

import { 
    OrganizationService, 
    PersonService, 
    RankService
} from '../../services';

@Component({
    selector: 'person-dialog',
    templateUrl: 'person.dialog.html',
    providers: [ OrganizationService, PersonService, RankService ]
})
export class PersonDialog implements OnInit{
    
    constructor(
        private dialogRef: MatDialogRef<PersonDialog>,
        public organizationSvc: OrganizationService,
        public personSvc: PersonService,
        public rankSvc: RankService,
        @Inject(MAT_DIALOG_DATA) public person: Person
    )   { }

    ngOnInit() {
        this.organizationSvc.getOrganizations();
        this.rankSvc.getRanks();
    }

    savePerson = async () => {
        const res = this.person.id > 0
            ? await this.personSvc.updatePerson(this.person)
            : await this.personSvc.addPerson(this.person);

        res && this.dialogRef.close(true)
    }
}