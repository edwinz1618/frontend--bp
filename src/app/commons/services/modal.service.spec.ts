import { TestBed } from '@angular/core/testing';

import { IConfigModal, IModal } from '../models/components-model';
import { ModalService } from './modal.service';

describe('ServiceNameService', () => {
	let service: ModalService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ModalService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should emit a configModal object when openModal is called', () => {
		const config: IModal = { title: 'Titulo' };
		const expectedConfigModal: IConfigModal = { ...config, show: true };

		const channelAction$ = service.openModal(config);

		expect(service['configModal']).toEqual(expectedConfigModal);
		expect(service.channelAction$).toEqual(channelAction$);
	});

	it('should emit a configModal object with show set to false when closeModal is called', () => {
		const config: IModal = { title: 'Titulo' };
		const expectedConfigModal: IConfigModal = { ...config, show: false };

		service.openModal(config);
		service.closeModal();

		expect(service['configModal']).toEqual(expectedConfigModal);
	});
});
