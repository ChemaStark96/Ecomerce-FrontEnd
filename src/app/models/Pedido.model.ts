export interface Pedido {
    id: number | null;
    idCliente: number;
    idProducto: number[];
    total: number; // se calcula en el backend
    idEstatus: number;
}  