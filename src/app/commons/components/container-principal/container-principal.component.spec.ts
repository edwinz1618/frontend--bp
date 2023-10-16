import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterOutlet } from '@angular/router';
import { ContainerPrincipalComponent } from './container-principal.component';

describe('ContainerPrincipalComponent', () => {
	let component: ContainerPrincipalComponent;
	let fixture: ComponentFixture<ContainerPrincipalComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ContainerPrincipalComponent],
			imports: [RouterOutlet]
		});
		fixture = TestBed.createComponent(ContainerPrincipalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
