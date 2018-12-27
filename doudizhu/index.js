
let douzizhu = {
    rooms:{},
    joinRoom: function(roomId, ctx){
        let flag = false; 
        let rooms = this.rooms;
        if(rooms['room'+roomId]){
            if(rooms['room'+roomId].length == 3) return flag;
            flag = true;
            rooms['room'+roomId].push(ctx);
        }else{
            flag = true;
            rooms['room'+roomId] = [];
            rooms['room'+roomId].push(ctx);
        }
        return flag;
    },
    getCardsList: function(){
        let allCards = [3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,17];
        let tempCards = [].concat(allCards);
        tempCards.sort(douzizhu.randomsort);
        let acards = [], bcards=[], ccards=[];
        for(let i=0; i<6; i++){//算法有点垃圾，玩家abc三人各拿5手三张，再拿一手2张，最后三张是地主牌
            if(i == 5){
                acards.push(tempCards[i*9+0]);
                acards.push(tempCards[i*9+1]);
                bcards.push(tempCards[i*9+2]);
                bcards.push(tempCards[i*9+3]);
                ccards.push(tempCards[i*9+4]);
                ccards.push(tempCards[i*9+5]);
            }else{
                acards.push(tempCards[i*9+0]);
                acards.push(tempCards[i*9+1]);
                acards.push(tempCards[i*9+2]);
                bcards.push(tempCards[i*9+3]);
                bcards.push(tempCards[i*9+4]);
                bcards.push(tempCards[i*9+5]);
                ccards.push(tempCards[i*9+6]);
                ccards.push(tempCards[i*9+7]);
                ccards.push(tempCards[i*9+8]);
            }
        }
        return [acards.sort(douzizhu.sortNumber), bcards.sort(douzizhu.sortNumber), ccards.sort(douzizhu.sortNumber), tempCards.splice(51).sort(douzizhu.sortNumber)];
    },
    randomsort: function(a, b) {
        return Math.random()>.5 ? -1 : 1;
    },
    sortNumber: function(a,b){
        return a - b;
    },
    handleJoinRoom: function(data, ctx){
        console.log(data);
        let roomId = data.room;
        let result = douzizhu.joinRoom(roomId, ctx);
        if(!result) {
            ctx.websocket.send(JSON.stringify({method:'joinRoom',data:{status: 0}}));
            return ;
        }
        let cRoom = this.rooms['room'+roomId];
        cRoom.map(cctx=>{
            if(cctx != ctx){
                cctx.websocket.send(JSON.stringify({method:'joinRoom',data:{}}));
            }else{
                for(let i=0;i<cRoom.length-1;i++){//自己进房间后，把已经再的玩家发给自己
                    cctx.websocket.send(JSON.stringify({method:'joinRoom',data:{}}));
                } 
            }
        });
        if(cRoom.length == 3){
            let cardsList = douzizhu.getCardsList(),i=0;
            let dFlag = Math.floor(Math.random() * 3);
            cRoom.map(cctx=>{
                cctx.websocket.send(JSON.stringify({method:'giveCards',data:{pos: i, dFlag: dFlag, cards:cardsList[i], ocards:cardsList[3]}}));
                if(dFlag == i){
                    cctx.websocket.send(JSON.stringify({method:'showJiaoDiZhu',data:{pos: i}}));
                }
                i++;
            });
        }
    },
    handlePostCards: function(data){
        let roomId = data.room;
        let cRoom = this.rooms['room'+roomId];
        let pos = data.pos;
        var npos = pos == 2? 0 : pos+1;

        if(data.isComplete){
            npos = -1;
        }

        cRoom.map(cctx=>{
            cctx.websocket.send(JSON.stringify({method:'postCards',data:{pos: pos, nextPost: npos, cardType: data.cardType, cards: data.cards, keyCard: data.keyCard}}));           
            if(data.isComplete){
                cctx.websocket.send(JSON.stringify({method:'gameOver',data:{isDiZhu: data.isDiZhu}}));
            }
        });

        //cRoom[pos].websocket.send(JSON.stringify({method:'postCardFlag',data:{pos: pos}}));//出牌标志位
    },
    jiaoDiZhu: function(data, ctx){
        let cRoom = this.rooms['room'+data.room];
        var pos = data.pos;

        cRoom.map(cctx=>{
            cctx.websocket.send(JSON.stringify({method:'showDiZhu',data:{dpos: pos}}));   //展示谁时地主
        });

        cRoom[pos].websocket.send(JSON.stringify({method:'postCardFlag',data:{pos: pos}}));//出牌标志位
    },
    bujiaoDiZhu: function(data, ctx){
        let cRoom = this.rooms['room'+data.room];
        var pos = data.pos;
        if(pos == 2){
            pos = 0;
        }else{
            pos++;
        }

        cRoom[pos].websocket.send(JSON.stringify({method:'showJiaoDiZhu',data:{pos: pos}}));//显示叫地主
    },
    handleMessgae: function(mes, ctx){
        var data = JSON.parse(mes);
        switch(data.method){
            case 'joinRoom' : douzizhu.handleJoinRoom(data.data, ctx); break;
            case 'postCards': douzizhu.handlePostCards(data.data, ctx); break;
            case 'jiaoDiZhu': douzizhu.jiaoDiZhu(data.data, ctx); break;
            case 'bujiaoDiZhu': douzizhu.bujiaoDiZhu(data.data, ctx); break;
        }
    }
}


module.exports = douzizhu