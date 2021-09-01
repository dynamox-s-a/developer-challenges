const BASEAPI = 'http://localhost:5000';

const apiFetchPost = async (endpoint, body) => {
    const res = await fetch(BASEAPI+endpoint, {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)
    });
    const json = await res.json();
    if(json.notallowed) {
        window.localtion.href = '/';
        return;
    }
    return json;
}

const apiFetchPut = async (endpoint, body) => {
    const res = await fetch(BASEAPI+endpoint, {
        method:'PUT',
        headers:{
            'Accept':'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const json = await res.json();
    if(json.notallowed) {
        window.localtion.href = `/product/${body.id}`;
        return;
    }
    return json;
}
const apiFetchDelete = async (endpoint, body) => {
    const res = await fetch(BASEAPI+endpoint, {
        method:'DELETE',
        headers:{
            'Accept':'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const json = await res.json();
    if(json.notallowed) {
        window.localtion.href = `/data/${body.id}`;
        return;
    }
    return json;
}

export default {
    getProducts : async () => {
        const res = await fetch(BASEAPI+'/data');
        const json = await res.json();
        return json;
    },
    addProduct:async (nome, dataFabricacao, perecivel, dataValidade, preco) => {
        const json = await apiFetchPost(
            '/data',
            {
                nome,
                dataFabricacao,
                perecivel,
                dataValidade,
                preco
        
            }
        );
        return json;
    },
    editProduct:async (id, nome, dataFabricacao, perecivel, dataValidade, preco) => {
        const json = await apiFetchPut(
            `/data/${id}`,
            {
                id,
                nome,
                dataFabricacao,
                perecivel,
                dataValidade,
                preco
        
            }
        );
        return json;
    },
    deleteProduct:async (id) => {
        const json = await apiFetchDelete(
            `/data/${id}`,
            {id}
        );
        return json;
    },
    
    
};