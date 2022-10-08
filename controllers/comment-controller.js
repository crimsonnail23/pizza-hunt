const { Comment, Pizza }=require('../models');

const commentController={
    //add comment to pizza.
    addComment({ params, body }, res){
        console.log('line 6 params' + params)
        console.log('line 7 body' + body);
        Comment.create(body)
            .then(({_id})=>{
                console.log(_id)
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $push: { comments: _id }},
                    { new: true }
                );
            })
            .then(dbPizzaData =>{
                if(!dbPizzaData){
                    res.status(404).json({ message: 'no pizza found with this id'});
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err=> res.json(err));
    },
    //add a reply
    addReply({params,body}, res){
        Comment.findOneAndUpdate(
            { _id: params.commentId},
            { $push: {replies:body}},
            {new:true, runValidators: true},
        )
        .then(dbPizzaData=>{
            if(!dbPizzaData){
            res.status(404).json({ message: 'no pizza found with this id' });
            return;
            }
            res.json(dbPizzaData);
        })
        .catch(err=> res.json(err));
        
    },
    //remove a reply
    removeReply({params}, res){
        Comment.findOneAndUpdate(
            {_id: params.commentId},
            {$pull:{replies: {replyId: params.replyId } } },
            {new: true}
        )
        .then(dbPizzaData=>res.json(dbPizzaData))
        .catch(err=> res.json(err));
    },
    //remove comment.
    removeComment({ params }, res){
        console.log('ln 29 comment controller '+ params)
        Comment.findOneAndDelete({ _id: params.commentId})
            .then(deletedComment=>{
                console.log('ln 32 ' + deletedComment) //it shows up as 'null'.
                if (!deletedComment){
                    return res.status(404).json({ message: 'no comment with this id'});
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true}
                );
            })
            .then(dbPizzaData=>{
                if(!dbPizzaData){
                    res.status(404).json({ message: 'no pizza found with this id' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err=> res.json(err));
    }
}

module.exports = commentController;