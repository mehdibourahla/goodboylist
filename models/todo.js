var mongoose = require('mongoose');
var todoSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    task: String,
    deadline: Date,
    description: String,
    isDone: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Todo",todoSchema);