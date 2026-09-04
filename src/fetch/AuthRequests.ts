export interface LoginDTO {
    email: string;
    senha: string;
}

export const AuthRequests = {
    async login(dados: LoginDTO) {
        // Altere a porta (3000, 8080, etc.) conforme a porta do seu backend
        const response = await fetch("http://localhost:3333/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.mensagem || "Credenciais inválidas.");
        }

        return data;
    }
};