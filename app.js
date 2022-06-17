
//Modelo de objeto ao cadastrar.
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd { //Aqui criamos a lógica de indices dinâmicos, achei massa pq ja tentei usar o localstorage dessa forma e não consegui.
    constructor() {

        let id = localStorage.getItem('id')//Ao iniciar, se for null, o prox valor é 0, torando o id após cada insercao    
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    //Salvando no localstorage e usando JSON.
    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }
}

let bd = new Bd()

//Função é chamada no botão de adicionar no index
function cadastrarDespesa() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    //A resolução abaixo é uma resposta a um desafio proposto pelo prof, desenvolvi sozinho.
    if (despesa.validarDados()) {
        bd.gravar(despesa) //Salvando no localStorage ao criar um item

        let novoTitulo = document.getElementById('titulo_modal') //Desafio utilizando apenas 1 modal, para exibir tanto certo quanto errado. **
        let descricaoCampo = document.getElementById('cadastroSucesso')

        //Capturando a class do elemento pai
        let classeSuccess = novoTitulo.parentNode
        classeSuccess.classList = 'modal-header text-success'

        //Alterando a classe do botão
        let classeBotao = document.getElementById('btnVoltar')
        classeBotao.classList = "btn btn-success"

        novoTitulo.innerHTML = 'Registro inserido com sucesso'
        descricaoCampo.innerHTML = 'Despesa cadastrada com sucesso'
        
        //Chamando o modal Sucesso pelo Jquery.
        $('#modalRegistraDespesa').modal('show')

    } else {

        let novoTitulo = document.getElementById('titulo_modal')
        let descricaoCampo = document.getElementById('cadastroSucesso')

        //Capturando a class do elemento pai
        let classeError = novoTitulo.parentNode
        classeError.classList = 'modal-header text-danger' //Aplicando a classe Danger

        //Alterando a classe do botão
        let classeBotao = document.getElementById('btnVoltar')
        classeBotao.classList = "btn btn-danger"

        novoTitulo.innerHTML = 'Erro de gravação'
        descricaoCampo.innerHTML = 'Existem campos obrigatórios que não foram preenchidos'

        //Chamando o modal Error pelo Jquery.
        $('#modalRegistraDespesa').modal('show') 
    }

}
