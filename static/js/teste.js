const frm = document.querySelector('form');
const ip_value = document.getElementById('ip');
const resp = document.querySelector('.resp')
const resp_tracert= document.querySelector('.resp_tracert')


frm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const value = ip_value.value

    if (value.trim() === ""){
        alert('Digite um valor')
        return;
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
        resp.style.display = "block"; 
        resp.innerText = data.output
    } else {
        resp.style.display = "block"; 
        resp.innerText = 'Erro IP nao Encontrado'
    }

    //tracert
    const response_tracert = await fetch("http://127.0.0.1:5000/tracert", { //requisição pro meu flask
        method: "POST", //tipo de requisição que meu flask esta esperando
        headers: {
            "Content-Type": "application/json" //estou enviando em jscon
        },
        body: JSON.stringify({ ip: value }) //converte objeto js -> json
    })

    const data_tracert = await response_tracert.json()
    
    if (data_tracert.status === 'ok') {
        resp_tracert.style.display = "block"; 
        resp_tracert.innerText = data_tracert.output
    } else {
        resp_tracert.style.display = "block"; 
        resp_tracert.innerText = 'Erro IP nao Encontrado'
    }


})








