export interface Producto {
    id: number | null,
    idPedido: number,
    nombre: string,
    descripcion: string,
    precio: number,
    stock: number
}