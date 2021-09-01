

const BASEAPI = 'http://localhost:3000';

const apiFetchPost = async (endpoint, body) => {
    const res = await fetch(BASEAPI + endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();
  
    return json;
  };
  
const apiFetchPut = async (endpoint, body) => {
    const res = await fetch(BASEAPI + endpoint, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const json = await res.json();

    return json;
}

const apiFetchDelete = async (endpoint, body) => {
    const res = await fetch(BASEAPI + endpoint, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const json = await res.json();

    if (json.notallowed) {
        window.localtion.href = `/client/${body.idclients}`;
        return;
    }
    return json;
}



export default {

    
    login: async (email, password) => {
        const json = await apiFetchPost(
            '/users',
            { email, password }
        );
        return json;

    },
  
    getProdutos: async () => {
        const res = await fetch(BASEAPI + "/produtos");
        const json = await res.json();
        return json;
      },

    CadProdutos: async (nome, datafab, perecivel, datavenc, preco) => {
        const json = await apiFetchPost(
            '/produtos',
            {
                nome, datafab, perecivel, datavenc, preco
            }
        );
        return json;
    },

    PutProdutos: async (id, nome, datafab, perecivel, datavenc, preco) => {
        const json = await apiFetchPut(
            `/produtos/${id}`,
            {
                id, nome, datafab, perecivel, datavenc, preco
            }
        );
        return json;
    },

    DelProdutos: async (id) => {
        const json = await apiFetchDelete(
            `/produtos/${id}`,
            { id }
        );
        return json;
    },



};