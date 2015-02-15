"use strict";

const {View} = Backbone;
const ENTER_KEY = 13;

class HomeView extends View {

    initialize (options) {
        this.template = $('script[name="home"]').html();
        console.log("homeview init", options)
        this.events = {
            'click button#username': 'createUser',
            'click button#chatroom': 'createChatroom',
            'keyup input[type="text"]': 'keyPressEventHandler',
        };
        if (options && options.chatroomCollection && options.userCollection) {
            this.chatroomCollection = options.chatroomCollection;
            this.userCollection = options.userCollection;
        }
        // this.userCollection.on('all', this.render, this);
        // this.chatroomCollection.on('all', this.render, this);
    }

    render () {
        this.$el.html(_.template(this.template)({
            chatrooms: this.chatroomCollection.models
        }));
        return this;
    }

    createUser (event) {
        event.preventDefault();

        var $userName = this.$el.find('input[name="username"]');
        console.log(this.userCollection)
        this.userCollection.create({name: $userName.val()});
    }

    createChatroom (event){
        event.preventDefault();

        var $chatroom = this.$el.find('input[name="chatroom"]');
        console.log(this.chatroomCollection)
        this.chatroomCollection.create({name: $chatroom.val()});
    }

    keyPressEventHandler (event) {
        if(event.keyCode === ENTER_KEY){

            let inputName = $(event.currentTarget).attr("name");
            console.log(inputName === "username")
            console.log(inputName);
            if(inputName === "username"){
                this.createUser(event);
            }else{
                this.createChatroom(event);
            }

            //this.createUser(event);
        }
    }
}

class ChatroomView extends View {

    initialize (options) {
        console.log("chatroom init");
        this.template = $('script[name="chatroom"]').html();
        this.events = {
            'keyup #inputline': 'keyPressEventHandler'
        }
        this.socket = options.socket;
        this.model = options.model;

        /*
        this.socket.on('message', function(user, msg){
            console.log(user + ": " + msg);
            this.getMessage(user, msg)
        });
        */

    }

    render () {
        this.$el.html(_.template(this.template)({
            room: this.model
        }));
        return this;
    }

    // sendMessage (event) {
    //     console.log("sendMessage in ChatroomView")
    //     event.preventDefault();

    //     let $msg = this.$el.find('input[type="text"]');
    //     this.socket.emit('message', $msg.val());
    //     $msg.val('');
    // }

    // getMessage(user, msg){

    //     let h = new Date().getHours();
    //     let m = new Date().getMinutes();

    //     this.$el.find("#central_room").append($("<div class'line'><span class='timestamp'>"+ h +":"+ m +"</span><span class='user'>"+ user +"</span><span class='message'>"+ message +"</span>" ));
    // }

    // keyPressEventHandler (event){
    //     if(event.keyCode === ENTER_KEY){
    //         this.sendMessage(event);
    //     }
    // }
}

export {HomeView, ChatroomView};
