import { Service } from '@angular/core';

@Service()
export class Chatbot {
    private endpoint: string | null = null;

    configurarEndpoint(endpoint: string | null): void {
        this.endpoint = endpoint?.trim() || null;
    }

    async consultar(pregunta: string, contexto: Record<string, unknown>): Promise<string> {
        if (this.endpoint) {
            try {
                const response = await fetch(this.endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pregunta, contexto }),
                });
                if (!response.ok) throw new Error(`Error ${response.status}`);
                const resultado: { respuesta?: string } = await response.json();
                if (resultado.respuesta?.trim()) return resultado.respuesta;
            } catch {
                return 'No pude conectar con el servicio de IA. Revisa la conexión e inténtalo de nuevo.';
            }
        }

        return this.respuestaLocal(pregunta);
    }

    private respuestaLocal(pregunta: string): string {
        const consulta = pregunta.toLocaleLowerCase();
        if (consulta.includes('stock') || consulta.includes('inventario') || consulta.includes('producto')) {
            return 'En el resumen actual hay productos con stock bajo. Prioriza reponer los artículos agotados y revisa el ritmo de ventas antes de definir cantidades para evitar sobrecompras.';
        }
        if (consulta.includes('gasto') || consulta.includes('costo') || consulta.includes('publicidad')) {
            return 'Compara el gasto por categoría con las ventas que generó. En publicidad, pausa o ajusta las campañas que subieron sin mejorar conversiones y revisa el resultado durante la próxima semana.';
        }
        if (consulta.includes('venta') || consulta.includes('ingreso') || consulta.includes('meta')) {
            return 'Revisa el avance de ventas frente a la meta y el periodo anterior. Si hay una caída, identifica primero los productos con mejor margen y enfoca allí las promociones.';
        }
        if (consulta.includes('cliente') || consulta.includes('inactiv')) {
            return 'Contacta primero a los clientes frecuentes que dejaron de comprar. Una oferta personalizada y con fecha de vencimiento suele ser más fácil de medir que un descuento general.';
        }
        return 'Puedo ayudarte a analizar ventas, gastos, inventario o clientes. Prueba preguntarme, por ejemplo: “¿Qué debería revisar para reducir gastos?”';
    }
}
