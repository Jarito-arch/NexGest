import { Service, signal } from '@angular/core';

export interface CustomModule {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    icono: string;
    activo: boolean;
    campos?: { nombre: string; tipo: string }[];
}

@Service()
export class Tenant {
    readonly customModules = signal<CustomModule[]>([
        { id: 1, nombre: 'Órdenes de servicio', descripcion: 'Seguimiento de trabajos y solicitudes internas.', categoria: 'Operaciones', icono: 'bi-clipboard-check', activo: true },
        { id: 2, nombre: 'Activos y equipos', descripcion: 'Control de equipos, responsables y mantenimientos.', categoria: 'Administración', icono: 'bi-pc-display', activo: true },
    ]);

    constructor() {
        try {
            const saved = typeof localStorage === 'undefined' ? null : localStorage.getItem('nexgest-custom-modules');
            if (saved) {
                const modules: unknown = JSON.parse(saved);
                if (Array.isArray(modules)) this.customModules.set(modules as CustomModule[]);
            }
        } catch {
            // El estado en memoria sigue disponible si el almacenamiento del navegador no lo está.
        }
    }

    addCustomModule(module: Omit<CustomModule, 'id'>): CustomModule {
        const created = { ...module, id: Date.now() };
        this.customModules.update(current => [...current, created]);
        this.persistModules();
        return created;
    }

    toggleCustomModule(module: CustomModule): void {
        this.customModules.update(current => current.map(item => item.id === module.id ? { ...item, activo: !item.activo } : item));
        this.persistModules();
    }

    private persistModules(): void {
        try {
            if (typeof localStorage !== 'undefined') localStorage.setItem('nexgest-custom-modules', JSON.stringify(this.customModules()));
        } catch {
            // La sesión actual continúa funcionando incluso si no se puede persistir.
        }
    }
}
