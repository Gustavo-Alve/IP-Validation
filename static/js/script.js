const frm = document.querySelector('form')
const ip_value = document.getElementById('ip')
const resp = document.getElementById('resp')

frm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const value = ip_value.value

    if (value == null){
        alert('Digite um valor')
    }


    const response = await fetch("http://127.0.0.1:5000/ping", { //requisição pro meu flask
        method: "POST", //tipo de requisição que meu flask esta esperando
        headers: {
            "Content-Type": "application/json" //estou enviando em jscon
        },
        body: JSON.stringify({ ip: value }) //converte objeto js -> json
    })

    const data = await response.json() //converte minha resposta json em objeto Js
        //quem faz a validação e o python eu apenas envio nome ou ip que o usuario digitou
    if (data.status === 'ok') {
        resp.innerText = data.output
    } else {
        resp.innerText = 'Erro IP nao Encontrado'
    }
})








