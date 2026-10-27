class carro {
    constructor(nome, ano){
        this.nome = nome;
        this.ano = ano;
    }
    apresentar(){
        console.log('Ola, eu sou ana '+ this.nome)
    }
}
let impala = new carro('impala', 1967)
console.log(impala.nome)

