import {config} from '@/config'

const httpRequest = {

    methods: {
      Get: path => {
        return fetch(config.SERVER_URL + path, {
            method: 'GET'
        });
      },
      Post: (path, data) => {
        return fetch(this.URL + path, {
            method: 'POST',
            body: JSON.stringify(data)
        });

      },
      Put: (path, data) => {
        return fetch(this.URL + path, {
            method: 'PUT',
            body: JSON.stringify(data)
        });

      },
      Delete: (path) => {
        return fetch(this.URL, {
            method: 'DELETE'
        });
      }
    }
}

export const { Get, Post } = httpRequest.methods