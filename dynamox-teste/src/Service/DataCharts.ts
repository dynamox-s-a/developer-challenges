import axios from 'axios';

export async function getDataCharts() {
    const acceleration = await getAcceleration();
    const velocity = await getVelocity();
    const temperature = await getTemperature();
    

    return {
        "acceleration": acceleration,
        "velocity": velocity,
        "temperature": temperature,
    }
}

async function getAcceleration() {
    let retorno = await axios.get('http://localhost:3000/accelerationRms')
            .then(response => {
                return response.data
            })
    retorno = fixAcceleration(retorno)
    return retorno
}

async function getVelocity() {
    let retorno = await axios.get('http://localhost:3000/velocity')
            .then(response => {
                return response.data
            })

    retorno = fixVelocity(retorno)
    return retorno
}

async function getTemperature() {
    let retorno = await axios.get('http://localhost:3000/temperature')
            .then(response => {
                return response.data
            })
    retorno = fixTemperature(retorno)
    return retorno
}

function fixAcceleration(data) {
    const x = []
    const y = []
    data.x.forEach((item) => {
        const date = new Date(item.datetime)
        x.push([
            date.toString(),
            item.max
        ])
    })
    data.y.forEach((item) => {
        const date = new Date(item.datetime)
        y.push([
            date.toString(),
            item.max
        ])
    })
    return [
        {
            name: 'Axial',
            data: x
        },
        {
            name: 'Horizontal',
            data: y
        },
    ]
}

function fixVelocity(data) {
    const x = []
    const y = []
    const z = []
    data.x.forEach((item) => {
        const date = new Date(item.datetime)
        x.push([
            date.toString(),
            item.max
        ])
    })
    data.y.forEach((item) => {
        const date = new Date(item.datetime)
        y.push([
            date.toString(),
            item.max
        ])
    })
    data.z.forEach((item) => {
        const date = new Date(item.datetime)
        z.push([
            date.toString(),
            item.max
        ])
    })
    return [
        {
            name: 'Axial',
            data: x
        },
        {
            name: 'Horizontal',
            data: y
        },
        {
            name: 'Radial',
            data: z
        },
    ]
}

function fixTemperature(data) {
    const y = []
    data.y.forEach((item) => {
        const date = new Date(item.datetime)
        y.push([
            date.toString(),
            item.max
        ])
    })
    return [
        {
            name: 'Temperatura',
            data: y
        },
    ]
}