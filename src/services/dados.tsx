import db from '../db.json';

/** 
 * @returns 
 * Dados dos gráficos
 */
const Repositorios = async () => {
    try {
        const response = db;
        if (response) {
            return response;
        } else {
            return [];
        }
    } catch (error) {
          console.error('Erro ao buscar dados:', error);
          return [];
    }
};

export default Repositorios
