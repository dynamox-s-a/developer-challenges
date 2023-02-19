import DataCreate from '@/interfaces/dataCreate';


const validateData = (data: DataCreate): string => {
    if (!data.name || data.name.length  <3) return 'O campo nome é obrigatorio';
    if(typeof data.fabricationDate === 'object' || typeof data.validate === 'object'){
        const fabricationDate = data.fabricationDate?.format('YYYY-MM-DD');
        const validateDate = data.validate?.format('YYYY-MM-DD');
        if (fabricationDate === undefined) return 'Data inválida.';
        if (validateDate === undefined) return 'Data inválida.';
        const f = new Date(fabricationDate);
        const v = new Date(validateDate);
        if (f>v) return 'A data de fabricação não pode ser maior que a data de válidade!';
    };
    if (data.price === 0) return 'O preço precisa ser maior que 0'
    return 'passou pelas condicionais';
}
export default validateData;