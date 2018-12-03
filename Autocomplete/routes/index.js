var express = require('express');
var router = express.Router();

/* GET home page. */
rounter.get('/', function(req,res){
	global.db.findAll((e,docs)=>{
		of(e){return console.log(e);}
		res.render('index',{title:'lista de Clientes', docs:docs});
	})
})

rounter.get('/new', function(req,res,next) {
	res.render('new',{title:'Novo cadastro' });
});

router.post('/new', function(req,res) {
	var name = req.body.nome;
	var idade = parseInt(req.body.idade);
	global.db.insert({nome,idade}, (err,result) => {
		if(err) {return console.log(err); }

res.redirect('/');
	})
})

rounter.get('/edit/:id', function(req,res,next) {
	var id = req.params.id;
	global.db.findOne(id,(e,docs)=>{
		if(e){return console.log(e);}
		res.render('new',{title:'Edição de cliente', doc: docs[0], action:'/edit/'+docs[0]._id});

	});
})
