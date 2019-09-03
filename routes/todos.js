var express = require('express');
var router  = express.Router({mergeParams:true});
var User    = require('../models/user');
var Todo    = require('../models/todo');
var middleware = require('../middleware');

//LIST ALL TODOS -INDEX
router.get("/",middleware.checkState,function(req,res){
    Todo.find({isDone: false, user: req.user},function(err,todos){
        if(err){
            console.log(err);
        }
        else{
            Todo.find({isDone: true, user: req.user._id}, function(err,doneTodos){
                if(err){
                    console.log(err);
                }
                else{
                    User.findById(req.user,function(err,user){
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.render("todos/index",{todos:todos, doneTodos:doneTodos,user:user});
                        }
                    });
                }
                
            });
        }
    });
});

//CREATE A NEW TODO FORM
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("todos/new");
});

//HANDLE A NEW TODO CREATION
router.post("/",middleware.isLoggedIn,function(req,res){
    var todo = req.body.todo;
    Todo.create(todo,function(err,newTodo){
        if(err){
            console.log(err);
        }
        else{
            newTodo.user = req.user._id;
            newTodo.save();
            res.redirect("/todos");
        }
    }); 
});

//SHOW A PARTICULAR TODO -SHOW
router.get("/:id",middleware.checkTaskOwnership,function(req,res){
    Todo.findById(req.params.id, function(err,todo){
        if(err){
            console.log(err);
        }
        else{
            res.render("todos/show",{todo:todo});
        }
    });
    
});

//UPDATE A TODO FORM
router.get("/:id/edit",middleware.checkTaskOwnership,function(req,res){
    Todo.findById(req.params.id,function(err,todo){
        if(err){
            console.log(err);
        }
        else{
            res.render("todos/edit",{todo:todo});
        }
    });
    
});

//HANDLE A TODO UPDATE
router.put("/:id",middleware.checkTaskOwnership,function(req,res){
    Todo.findByIdAndUpdate(req.params.id,req.body.todo,function(err,todo){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/todos");
        }
    });
});

//HANDLE A TODO DESTRUCTION
router.delete("/:id",middleware.checkTaskOwnership,function(req,res){
    Todo.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/todos");
        }
    });
});
//CHECK THE TODO
router.put("/:id/check",middleware.checkTaskOwnership,function(req,res){
    Todo.findById(req.params.id,function(err,todo){
        if(err){
            console.log(err);
        }
        else{
            todo.isDone = true;
            Todo.findByIdAndUpdate(todo._id,todo,function(err,newTodo){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect("/todos");
                }
            });
        }
    });
});
//UNCHECK THE TODO
router.put("/:id/uncheck",middleware.checkTaskOwnership,function(req,res){
    Todo.findById(req.params.id,function(err,todo){
        if(err){
            console.log(err);
        }
        else{
            todo.isDone = false;
            Todo.findByIdAndUpdate(todo._id,todo,function(err,newTodo){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect("/todos");
                }
            });
        }
    });
});

module.exports = router;