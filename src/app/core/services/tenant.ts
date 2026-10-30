import { Service, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Equipo } from './equipo';

export interface ModuleFieldDef {
    /** Clave estable del campo; se usa como propiedad en cada registro. */
    id?: string;
    nombre: string;
    tipo: string;
    /** Opciones para los campos de tipo "Selección". */
    opciones?: string[];
}

export interface CustomModule {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    icono: string;
    activo: boolean;
    campos?: ModuleFieldDef[];
    /** Módulo relacionado elegido en el paso 3 del asistente. */
    relacion?: string;
}

/** Un registro guarda sus valores bajo la clave de cada campo (ver `fieldKey`). */
export interface ModuleRecord {
    id: string;
    [campo: string]: unknown;
}

/** Clave con la que se guarda el valor de un campo dentro de un registro. */
export function fieldKey(campo: ModuleFieldDef, index: number): string {
    return campo.id ?? `c${index}`;
}

const MODULES_KEY = 'nexgest-custom-modules';
const recordsKey = (moduleId: number) => `nexgest-custom-records-${moduleId}`;

@Service()
export class Tenant {
    private platformId = inject(PLATFORM_ID);
    private equipo = inject(Equipo);

    readonly customModules = signal<CustomModule[]>([
        {
            id: 1, nombre: 'Órdenes de servicio', descripcion: 'Seguimiento de trabajos y solicitudes internas.',
            categoria: 'Operaciones', icono: 'bi-clipboard-check', activo: true,
            campos: [
                { id: 'titulo', nombre: 'Trabajo', tipo: 'Texto' },
                { id: 'fecha', nombre: 'Fecha', tipo: 'Fecha' },
                { id: 'estado', nombre: 'Estado', tipo: 'Selección', opciones: ['Pendiente', 'En curso', 'Terminada'] },
                { id: 'monto', nombre: 'Monto', tipo: 'Moneda' },
            ],
        },
        {
            id: 2, nombre: 'Activos y equipos', descripcion: 'Control de equipos, responsables y mantenimientos.',
            categoria: 'Administración', icono: 'bi-pc-display', activo: true,
            campos: [
                { id: 'equipo', nombre: 'Equipo', tipo: 'Texto' },
                { id: 'responsable', nombre: 'Responsable', tipo: 'Texto' },
                { id: 'compra', nombre: 'Fecha de compra', tipo: 'Fecha' },
                { id: 'operativo', nombre: 'Operativo', tipo: 'Booleano' },
            ],
        },
    ]);

    /** Registros de cada módulo personalizado, indexados por id de módulo. */
    readonly recordsByModule = signal<Record<number, ModuleRecord[]>>({});

    constructor() {
        const saved = this.read(MODULES_KEY);
        if (Array.isArray(saved)) this.customModules.set(saved as CustomModule[]);

        const loaded: Record<number, ModuleRecord[]> = {};
        for (const modulo of this.customModules()) {
            const records = this.read(recordsKey(modulo.id));
            if (Array.isArray(records)) loaded[modulo.id] = records as ModuleRecord[];
        }
        this.recordsByModule.set(loaded);
    }

    getModule(id: number): CustomModule | undefined {
        return this.customModules().find(item => item.id === id);
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

    /** Elimina el módulo con todos sus registros y le quita el acceso a los empleados. */
    removeCustomModule(id: number): void {
        this.customModules.update(current => current.filter(item => item.id !== id));
        this.persistModules();
        this.recordsByModule.update(current => {
            const resto = { ...current };
            delete resto[id];
            return resto;
        });
        if (isPlatformBrowser(this.platformId)) {
            try {
                localStorage.removeItem(recordsKey(id));
            } catch {
                // Si no se puede borrar, los registros quedan huérfanos pero ya no se muestran.
            }
        }
        this.equipo.revocarModulo(`custom:${id}`);
    }

    // ----- Registros de cada módulo -----

    recordsOf(moduleId: number): ModuleRecord[] {
        return this.recordsByModule()[moduleId] ?? [];
    }

    addRecord(moduleId: number, data: Record<string, unknown>): ModuleRecord {
        const created: ModuleRecord = { ...data, id: `r${Date.now()}${Math.floor(Math.random() * 1000)}` };
        this.saveRecords(moduleId, [...this.recordsOf(moduleId), created]);
        return created;
    }

    updateRecord(moduleId: number, recordId: string, data: Record<string, unknown>): void {
        this.saveRecords(moduleId, this.recordsOf(moduleId).map(item => item.id === recordId ? { ...data, id: recordId } : item));
    }

    deleteRecord(moduleId: number, recordId: string): void {
        this.saveRecords(moduleId, this.recordsOf(moduleId).filter(item => item.id !== recordId));
    }

    private saveRecords(moduleId: number, records: ModuleRecord[]): void {
        this.recordsByModule.update(current => ({ ...current, [moduleId]: records }));
        this.write(recordsKey(moduleId), records);
    }

    private persistModules(): void {
        this.write(MODULES_KEY, this.customModules());
    }

    // ----- Acceso protegido a localStorage (SSR) -----

    private read(key: string): unknown {
        if (!isPlatformBrowser(this.platformId)) return null;
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null; // El estado en memoria sigue disponible si el almacenamiento falla.
        }
    }

    private write(key: string, value: unknown): void {
        if (!isPlatformBrowser(this.platformId)) return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // La sesión actual continúa funcionando incluso si no se puede persistir.
        }
    }
}
