
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

    //Recuperar dados salvos, ao carregar a página. Usando o onloa no body.
    recuperarTodosRegistros() {
        let despesas = []

        let id = localStorage.getItem('id')

        //Recuperando todas as despesas cadastradas em localStorage
        for (let i = 1; i <= id; i++) {
            //Recuperar despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //verificar se existe a possibilidade de indices pulados ou removidos,
            //Neste caso vamos pular esses índices..
            if (despesa === null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa) {
        let despesasFiltradas = []
        despesasFiltradas = this.recuperarTodosRegistros() //Caso no futuro mude a api, banco de dados, por aqui que será feito.

        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)//Obs: O .filter me retorna outro array, não é o original* Por isso ele armazena em despesasFiltradas de novo.
        }
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
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

        //Resolução de um desafio: Apagando dados do form após inserir a despesa com sucesso.
        //Ao modal de sucesso ser exibido, após clicar em 'voltar' todos os campos são zerados.
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''


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

function carregaListaDespesas(despesas = []) {
    // let despesas = [] //Recebendo o array ja verificado do localstorage ao carregar a página.
    if(despesas.length == 0){
        despesas = bd.recuperarTodosRegistros()
    }

    //Elemento tbody (consulta)
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //Percorrer o array despesas, listando despesa de forma dinâmica
    despesas.forEach(function (d) {

        //Criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //Criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`

        //ajustar o tipo, antes vinha só o número, 0, 1, 2... Referente as definições dentro do switch.
        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //Criando o botão de excluir
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class ="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}` //Para não confundir muito..
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_', '')

            bd.remover(id)
            //att a pagina
            window.location.reload()
        }

        linha.insertCell(4).append(btn)

    })
}

//Pesquisando despesas na pagina consulta
function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas= bd.pesquisar(despesa) //Função responsável por receber o retorno, e imprimir na view após filtrar/consulta.

    //Substituindo toda a lógica
    carregaListaDespesas(despesas)
}
