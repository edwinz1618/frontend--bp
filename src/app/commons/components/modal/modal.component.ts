import { NgClass } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [NgClass]
})
export class ModalComponent implements OnInit {

  readonly modalService = inject(ModalService);
  title = ''
  show = false

  ngOnInit(): void {
    this.modalService.channel$.subscribe((config) => {
      this.title = config.title;
      this.show = config.show
    })
  }
  confirm(){
    this.modalService.sourceAction.next(true);
    this.modalService.closeModal();
  }
}
