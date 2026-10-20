import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomModule, Tenant } from '../../core/services/tenant';

type FieldType = 'Texto' | 'Número' | 'Moneda' | 'Fecha' | 'Hora' | 'Booleano' | 'Selección' | 'Archivo' | 'Relación';

interface ModuleField {
  id: number;
  nombre: string;
  tipo: FieldType;
}

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-custom-modules',
  styleUrl: './custom-modules.css',
  templateUrl: './custom-modules.html',
})
export class CustomModules {
  private readonly tenant = inject(Tenant);
  readonly pasos = ['Nombre', 'Campos', 'Relaciones', 'Vista previa', 'Crear'];
  readonly titulos = [
    'Define tu módulo',
    'Agrega los campos',
    'Conecta tus datos',
    'Revisa tu módulo',
    'Confirma la creación',
  ];
  readonly descripciones = [
    'Elige un nombre y una categoría para el nuevo espacio de trabajo.',
    'Agrega los datos que quieres registrar y define su formato.',
    'Relaciona este módulo con otras áreas de NexGest si lo necesitas.',
    'Así se verá el módulo cuando esté disponible para tu equipo.',
    'Al crearlo, aparecerá en el menú lateral y quedará guardado en este navegador.',
  ];
  readonly tiposCampo: FieldType[] = ['Texto', 'Número', 'Moneda', 'Fecha', 'Hora', 'Booleano', 'Selección', 'Archivo', 'Relación'];

  nombre = '';
  descripcion = '';
  categoria = 'Operaciones';
  filtro = 'Todos';
  paso = 0;
  nuevoCampo = '';
  tipoNuevoCampo: FieldType = 'Texto';
  relacion = '';
  moduloCreado: CustomModule | null = null;
  campos: ModuleField[] = [
    { id: 1, nombre: 'Nombre', tipo: 'Texto' },
  ];

  get modulos(): CustomModule[] { return this.tenant.customModules(); }
  get modulosFiltrados(): CustomModule[] {
    return this.filtro === 'Todos' ? this.modulos : this.modulos.filter(modulo => modulo.categoria === this.filtro);
  }
  get iconoModulo(): string { return this.categoria === 'Comercial' ? 'bi-briefcase' : this.categoria === 'Administración' ? 'bi-clipboard-data' : 'bi-grid'; }

  continuar(): void {
    if (this.paso === 0 && !this.nombre.trim()) return;
    this.paso = Math.min(this.paso + 1, this.pasos.length - 1);
  }

  volver(): void {
    this.paso = Math.max(this.paso - 1, 0);
  }

  irAlPaso(paso: number): void {
    if (paso < this.paso) this.paso = paso;
  }

  agregarCampo(): void {
    const nombre = this.nuevoCampo.trim();
    if (!nombre) return;
    this.campos = [...this.campos, { id: Date.now(), nombre, tipo: this.tipoNuevoCampo }];
    this.nuevoCampo = '';
  }

  quitarCampo(index: number): void {
    this.campos = this.campos.filter((_, i) => i !== index);
  }

  iconoTipo(tipo: FieldType): string {
    const iconos: Record<FieldType, string> = {
      Texto: 'bi-text-left', Número: 'bi-123', Moneda: 'bi-currency-dollar', Fecha: 'bi-calendar3',
      Hora: 'bi-clock', Booleano: 'bi-toggle-on', Selección: 'bi-list-check', Archivo: 'bi-file-earmark', Relación: 'bi-link-45deg',
    };
    return iconos[tipo];
  }

  crearModulo(): void {
    const nombre = this.nombre.trim();
    if (!nombre || this.paso !== 4) return;
    const creado = this.tenant.addCustomModule({
      nombre,
      descripcion: this.descripcion.trim() || 'Módulo personalizado para tu operación.',
      categoria: this.categoria,
      icono: this.iconoModulo,
      activo: true,
      campos: this.campos.map(({ nombre: campoNombre, tipo }) => ({ nombre: campoNombre, tipo })),
    });
    this.moduloCreado = creado;
  }

  alternar(modulo: CustomModule): void {
    this.tenant.toggleCustomModule(modulo);
  }

  nuevoModulo(): void {
    this.nombre = '';
    this.descripcion = '';
    this.categoria = 'Operaciones';
    this.relacion = '';
    this.campos = [{ id: Date.now(), nombre: 'Nombre', tipo: 'Texto' }];
    this.paso = 0;
    this.moduloCreado = null;
  }
}
