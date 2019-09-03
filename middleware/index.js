var User = require('../models/user')
var Todo = require('../models/todo');
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.redirect("/login");
    }
}

middlewareObj.canLog = function(req,res,next){
    if(!req.isAuthenticated()){
        next();
    }
    else{
        res.redirect('/todos');
    }
}

middlewareObj.checkTaskOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Todo.findById(req.params.id,function(err,todo){
            if(err){
                console.log(err);
                res.redirect("back");
            }
            else{
                if(todo.user.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }
    else{
        res.redirect('/login');
    }
}

middlewareObj.checkState = function(req,res,next){
    if(req.isAuthenticated()){
        var today = new Date(Date.now());
        today = today.toISOString().split('T')[0];
        Todo.countDocuments({
            isDone:false,
            user: req.user._id,
            deadline: { $lt: today }
        },
            function(err,count){
            if(err){
                console.log(err);
            }
            else{
                User.findById(req.user._id,function(err,user){
                    if(err){
                        console.log(err);
                    }
                    else{
                        user.state = count;
                        user.save(function(err){
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log(user);
                                next();
                            }
                        });
                        
                    }
                })
            }
            
        });
    }
    else{
        res.redirect('/login');
    }
    
}

module.exports = middlewareObj;