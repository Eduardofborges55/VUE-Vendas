import axios from "axios"

const api = axios.create({
    baseURL: 'https://localhost:5000/api'
})

export interface Denuncia {
    Id: number,
    URL: string,
    Preco: number,
    Email: string
}

export default {

    async salvar(denuncia: Denuncia): Promise<void> {
        await api.post('/denuncias', denuncia)
    },

    async listar(): Promise<Denuncia[]> {
        const response = await api.get('/denuncias')
        return response.data
    },

    async editar(denuncia: Denuncia): Promise<void> {
        await api.put(`/denuncias/${denuncia.Id}`, denuncia)
    },

    async excluir(id: number): Promise<void> {
        await api.delete(`/denuncias/${id}`)
    }

}