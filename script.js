let usuarios = [];
let usuarioAtual = null;

// --- Funções de Usuário ---
function salvarUsuarios() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function carregarUsuarios() {
    const dados = localStorage.getItem("usuarios");
    if(dados) usuarios = JSON.parse(dados);

    const selecionado = localStorage.getItem("usuarioAtualIndex");
    if(selecionado !== null) usuarioAtual = usuarios[parseInt(selecionado)];
}

function mostrarMensagem(id, msg, erro=false) {
    const el = document.getElementById(id);
    el.innerText = msg;
    el.style.color = erro ? "red" : "green";
    setTimeout(()=>{ el.innerText = ""; }, 3000);
}

function cadastrarUsuario() {
    const nome = document.getElementById("nome").value;
    const idade = parseInt(document.getElementById("idade").value);
    const email = document.getElementById("email").value;

    if(!nome || !idade || !email){
        mostrarMensagem("msgUsuario","Preencha todos os campos!",true);
        return;
    }

    usuarios.push({nome, idade, email, saldo:0, gastos:[]});
    salvarUsuarios();
    mostrarMensagem("msgUsuario",`Usuário ${nome} cadastrado!`);
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("email").value = "";
}

function selecionarUsuario() {
    const index = parseInt(document.getElementById("usuarioIndex").value)-1;
    if(index>=0 && index<usuarios.length){
        usuarioAtual = usuarios[index];
        localStorage.setItem("usuarioAtualIndex", index);
        document.getElementById("usuarioSelecionado").innerText = `Usuário: ${usuarioAtual.nome}`;
    } else {
        mostrarMensagem("msgUsuario","Usuário inválido!",true);
    }
}

// --- Funções de Gastos ---
function atualizarListaGastos() {
    const lista = document.getElementById("listaGastos");
    if(!lista) return;
    lista.innerHTML = "";

    if(!usuarioAtual || usuarioAtual.gastos.length===0){
        lista.innerHTML = "<li>Nenhum gasto registrado</li>";
        return;
    }

    usuarioAtual.gastos.forEach(g=>{
        const li = document.createElement("li");
        li.textContent = `${g.descricao}: R$ ${g.valor.toFixed(2)}`;
        lista.appendChild(li);
    });
}

function adicionarGasto() {
    if(!usuarioAtual){
        alert("Selecione um usuário!");
        return;
    }
    const desc = document.getElementById("descricao").value;
    const val = parseFloat(document.getElementById("valor").value);
    if(!desc || isNaN(val)){
        alert("Preencha corretamente os campos!");
        return;
    }

    usuarioAtual.gastos.push({descricao:desc, valor:val});
    salvarUsuarios();
    document.getElementById("descricao").value="";
    document.getElementById("valor").value="";

    atualizarListaGastos();
    atualizarGrafico();
}

// --- Função do Gráfico ---
function atualizarGrafico(){
    if(!usuarioAtual || usuarioAtual.gastos.length===0) return;

    const ctx = document.getElementById("graficoGastos");
    if(!ctx) return;

    const labels = usuarioAtual.gastos.map(g=>g.descricao);
    const data = usuarioAtual.gastos.map(g=>g.valor);

    if(window.grafico) window.grafico.destroy();

    window.grafico = new Chart(ctx,{
        type:'bar',
        data:{
            labels: labels,
            datasets:[{
                label:'Gastos',
                data:data,
                backgroundColor:'rgba(63,81,181,0.7)',
                borderColor:'rgba(63,81,181,1)',
                borderWidth:1
            }]
        },
        options:{
            responsive:true,
            animation:{ duration:800 },
            scales:{ y:{ beginAtZero:true } }
        }
    });
}

// --- Inicialização ---
window.onload = function(){
    carregarUsuarios();
    atualizarListaGastos();
    atualizarGrafico();
};
