import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DestinatiiService } from '../shared/destinatii.service';
import { Destinatie } from '../shared/destinatie.interface';
import { DestinatieDTO } from '../shared/addDestination.dto';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss',
})
export class AgentComponent implements OnInit {
  isEditMode = false;
  editDestinateForm!: FormGroup;
  destinatii!: Destinatie[];
  isAddingDestination = false;
  addDestinateForm!: FormGroup;
  selectedDestination!: Destinatie;

  constructor(
    private destinatiiService: DestinatiiService,
    private formBuilder: FormBuilder
  ) {
    this.addDestinateForm = this.formBuilder.group({
      titlu: ['', Validators.required],
      descriere: ['', Validators.required],
      locatie: ['', Validators.required],
      pret_per_noapte: ['', Validators.required],
      numar_locuri: ['', Validators.required],
      imagine: ['', Validators.required],
      procent_reducere: ['', Validators.required],
    });

    this.editDestinateForm = this.formBuilder.group({
      titlu: ['', Validators.required],
      descriere: ['', Validators.required],
      locatie: ['', Validators.required],
      pret_per_noapte: ['', Validators.required],
      numar_locuri: ['', Validators.required],
      imagine: ['', Validators.required],
      procent_reducere: ['', Validators.required],
    });
  }

  toggleEditMode(destinatie: Destinatie) {
    this.isEditMode = !this.isEditMode;
    this.selectedDestination = destinatie;

    this.editDestinateForm.patchValue({
      titlu: destinatie.titlu,
      descriere: destinatie.descriere,
      locatie: destinatie.locatie,
      pret_per_noapte: destinatie.pret_per_noapte,
      numar_locuri: destinatie.numar_locuri,
      imagine: destinatie.imagine,
      procent_reducere: destinatie.procent_reducere,
    });

    console.log(this.editDestinateForm);
  }

  onEditDestinatie(destinatieId: string) {
    if (this.editDestinateForm.valid) {
      const destinatieData = this.editDestinateForm.value;
      this.destinatiiService
        .updateDestination(destinatieId, destinatieData)
        .subscribe(() => {
          this.refreshDestinations();
          this.cancelEdit();
        });
    }
  }

  onDeleteDestination(destinationId: string) {
    this.destinatiiService.deleteDestination(destinationId).subscribe(() => {
      this.refreshDestinations();
    });
  }

  private refreshDestinations() {
    this.destinatiiService.getDestinations().subscribe((data: Destinatie[]) => {
      this.destinatii = data;
    });
  }

  ngOnInit(): void {
    this.destinatiiService.getDestinations().subscribe((data: Destinatie[]) => {
      this.destinatii = data;
    });
  }

  cancelEdit() {
    this.isEditMode = false;
  }

  toggleAddMode() {
    this.isAddingDestination = !this.isAddingDestination;
  }

  cancelAdd() {
    this.isAddingDestination = false;
    this.addDestinateForm.reset();
  }

  onAddDestinatie() {
    if (this.addDestinateForm.valid) {
      const newDestinatie: DestinatieDTO = {
        titlu: this.addDestinateForm.value.titlu,
        descriere: this.addDestinateForm.value.descriere,
        locatie: this.addDestinateForm.value.locatie,
        pret_per_noapte: this.addDestinateForm.value.pret_per_noapte,
        numar_locuri: this.addDestinateForm.value.numar_locuri,
        imagine: this.addDestinateForm.value.imagine,
        procent_reducere: this.addDestinateForm.value.procent_reducere,
      };

      this.destinatiiService.createDestination(newDestinatie).subscribe(() => {
        this.refreshDestinations();
        this.cancelAdd();
      });
    }
  }
}
