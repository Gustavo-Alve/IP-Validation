const frm = document.querySelector('form');
const ip_value = document.getElementById('ip');
const resp = document.querySelector('.resp');
const resp_tracert = document.querySelector('.resp_tracert');
const domainImgDiv = document.querySelector('.domain_img');


//função que adiciona animação de digitar
function typeText(element, text, speed = 10) {
    element.innerText = "";
    element.classList.add("typing");

    let i = 0;

    function typing() {
        if (i < text.length) {
            element.innerText += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        } else {
            element.classList.remove("typing");
        }
    }

    typing();
}

//função pra adicionar uma imagem de algum dominio
async function showDomainImage(domain) {
    if (!domainImgDiv) return;

    domainImgDiv.innerHTML = '<div class="loading-favicon">🔍</div>';

    let cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0];

    const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain=${cleanDomain}`;

    const img = document.createElement('img');
    img.src = faviconUrl;
    img.alt = cleanDomain;
    img.className = 'domain-favicon';

    img.onload = () => {
        domainImgDiv.innerHTML = '';
        domainImgDiv.appendChild(img);
    };

    img.onerror = () => {
        domainImgDiv.innerHTML = '<span class="no-image">🌐</span>';
    };
}

frm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const value = ip_value.value;

    if (value.trim() === "") {
        alert('Digite um valor');
        return;
    }
    //limpa os campos apos começar uma nova pesquisa
    resp.innerText = '';
    resp_tracert.innerText = '';
    domainImgDiv.innerHTML = '';
    showDomainImage(value);

    const response = await fetch("http://127.0.0.1:5000/ping", { //requisição pro meu flask
        method: "POST", //tipo de requisição que meu flask esta esperando
        headers: {
            "Content-Type": "application/json" //estou enviando em jscon
        },
        body: JSON.stringify({ ip: value }) //converte objeto js -> json
    });

    const data = await response.json(); 

    resp.style.display = "block";

    if (data.status === 'ok') {
        typeText(resp, data.output); // 🔥 agora sim
    } else {
        resp.innerText = 'Erro IP nao Encontrado';
    }





    // TRACERT
    const response_tracert = await fetch("http://127.0.0.1:5000/tracert", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ip: value })
    });

    const data_tracert = await response_tracert.json();

    resp_tracert.style.display = "block";

    if (data_tracert.status === 'ok') {
        typeText(resp_tracert, data_tracert.output); // 🔥 aqui também
    } else {
        resp_tracert.innerText = 'Erro no tracert';
    }
});