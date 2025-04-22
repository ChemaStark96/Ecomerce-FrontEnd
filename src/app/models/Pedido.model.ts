export interface Pedido {
    id: number | null,
    idCliente: number,
    idProducto: number,
    total: number,
    idEstatus: number
}