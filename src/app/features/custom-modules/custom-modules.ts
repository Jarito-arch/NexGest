import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomModule, Tenant } from '../../core/services/tenant';

type FieldType = 'Texto' | 'Número' | 'Moneda' | 'Fecha' | 'Hora' | 'Booleano' | 'Selección' | 'Archivo' | 'Relación';

interface ModuleField {
  id: number;
  nombre: string;
  tipo: FieldType;
  opciones?: string[];
}

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-custom-modules',
  styleUrls: ['./custom-modules.css', './custom-modules-steps.css'],
  templateUrl: './custom-modules.html',
})
export class CustomModules {
  private readonly tenant = inject(Tenant);
  private readonly router = inject(Router);
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
  opcionesNuevoCampo = '';
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

  /** Las opciones de un campo de tipo Selección se escriben separadas por coma. */
  get opcionesDelCampo(): string[] {
    return this.opcionesNuevoCampo.split(',').map(opcion => opcion.trim()).filter(Boolean);
  }
  get puedeAgregarCampo(): boolean {
    return !!this.nuevoCampo.trim() && (this.tipoNuevoCampo !== 'Selección' || this.opcionesDelCampo.length > 0);
  }

  continuar(): void {
    if (this.paso === 0 && !this.nombre.trim()) return;
    if (this.paso === 1 && this.campos.length === 0) return;
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
    if (!this.puedeAgregarCampo) return;
    const opciones = this.tipoNuevoCampo === 'Selección' ? [...new Set(this.opcionesDelCampo)] : undefined;
    this.campos = [...this.campos, { id: Date.now() + this.campos.length, nombre, tipo: this.tipoNuevoCampo, opciones }];
    this.nuevoCampo = '';
    this.opcionesNuevoCampo = '';
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
      campos: this.campos.map(({ id, nombre: campoNombre, tipo, opciones }) => ({ id: `f${id}`, nombre: campoNombre, tipo, ...(opciones ? { opciones } : {}) })),
      relacion: this.relacion || undefined,
    });
    this.moduloCreado = creado;
  }

  abrirModulo(): void {
    if (this.moduloCreado) this.router.navigate(['/custom-modules', this.moduloCreado.id]);
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
    this.opcionesNuevoCampo = '';
    this.paso = 0;
    this.moduloCreado = null;
  }
}
