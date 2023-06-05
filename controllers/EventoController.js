const Evento = require('../models/Evento');

const listarEventos = async (req,res) => {
   Evento.find({},{_id:true, __v:false}).then(result => {
    res.status(200).send(result);
    }).catch(e => res.status(400).send(e));
}

const buscarPorConteudo = async (req,res) =>{
    const {textSearch} = req.body
   Evento.find({text:{$search:textSearch}}).then(result =>{
    res.status(200).send(result);
    }).catch(e => res.status(400).send(e));

}

const salvarEvento = async (req,res) => {
    console.log("Teste");
   Evento.create(req.body).then(result => res.status(200).send
    (result)).catch(e => res.status(400).send(e));
}
   

const deletarEvento = async (req,res) =>{
   Evento.deleteOne({_id:req.params.id}).then(result => {
        if(result.deletedCount > 0) res.status(200).send('Removido com sucesso');
        else res.status(404).send('Evento não encontrada');
    }).catch(e => res.status(400).send(e));
}

const atualizarEvento = async (req,res) =>{
    const evento =  await Evento.findById({_id:req.params.id});
    if(evento==null){
        res.status(404).send('Evento nao encontrado');
    }else{
        evento[0].overwrite(req.body);
        await evento.save();
        res.status(200).send('Atualizado com sucesso')
    }
}


module.exports = {listarEventos,salvarEvento,buscarPorConteudo,deletarEvento,atualizarEvento};