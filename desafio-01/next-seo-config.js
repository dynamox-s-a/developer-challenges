const title = 'Solução DynaPredict'
const description = "Sensores e soluções tecnologicas da dynamox"
//teste
const SEO = {
    title, 
    description, 
    canonical: 'https://dynamox.net/en',
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url:'https://dynamox.net/en',
        title, 
        description, 
        images: [
            {
                url: '/public/logo-dynamox.png',
                alt: title, 
                width: 120,
                height: 120
            }
        ]
    }
}