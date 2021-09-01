const normalizeCep = (cep) => {
    if (typeof cep !== 'string') {
        cep = cep.toString()
    }
    return cep.replace('-', '');
};

const normalizeCPFAndCNPJ = (cpf_cnpj) => {
    if (typeof cep !== 'string') {
        cpf_cnpj = cpf_cnpj.toString()
    }
    return cpf_cnpj.replace('.', '')
        .replace('.', '')
        .replace('/', '')
        .replace('-', '');
};

/*--------------   Masks--------------*/

const maskCep = (cep) => {
    if (typeof cep !== "string") {
        cep = cep.toString();
    }

    return `${cep.substr(0, 5)}-${cep.substr(5, 8)}`;
};

const maskCpfCnpj = (cpf_cnpj) => {

    if (typeof cpf_cnpj !== "string") {
        cpf_cnpj = cpf_cnpj.toString();
    }
    if (cpf_cnpj.length === 14) {        
        return `${cpf_cnpj.substr(0, 2)}.${cpf_cnpj.substr(2, 3)}.${cpf_cnpj.substr(5, 3)}/${cpf_cnpj.substr(8, 4)}-${cpf_cnpj.substr(12, 2)}`;

    } else if (cpf_cnpj.length === 11) {
        return `${cpf_cnpj.substr(0, 3)}.${cpf_cnpj.substr(3, 3)}.${cpf_cnpj.substr(6, 3)}-${cpf_cnpj.substr(9, 2)}`;
    }

};


module.exports = { normalizeCPFAndCNPJ, normalizeCep, maskCep, maskCpfCnpj}