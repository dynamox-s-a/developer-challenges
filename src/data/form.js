const title = `Ficou com dúvida?\nNós entramos em contato com você`;

const formFields = [
    {
        name: "name",
        placeholder: "Como gostaria de ser chamado?",
        required: true
    },
    {
        name: "work-at",
        placeholder: "Em qual empresa você trabalha?",
        required: false
    },
    {
        name: "email",
        placeholder: "Digite aqui o seu email",
        required: true
    },
    {
        name: "phone",
        placeholder: "Qual seu telefone?",
        required: true
    },
]

export {
    title,
    formFields
}