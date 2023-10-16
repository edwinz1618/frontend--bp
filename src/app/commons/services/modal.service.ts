import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IConfigModal, IModal } from '../models/components-model';

@Injectable({ providedIn: 'root' })
export class ModalService {
	private _source = new Subject<IConfigModal>();
	sourceAction = new Subject();

	channel$ = this._source.asObservable();

	channelAction$ = this.sourceAction.asObservable();

	private configModal!: IConfigModal;

	openModal(config: IModal) {
		this.configModal = { ...config, show: true };
		this._source.next(this.configModal);
		return this.channelAction$;
	}

	closeModal() {
		this.configModal.show = false;
		this._source.next(this.configModal);
	}
}
