var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

class Blocks{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.width = 20;
        this.height = 20;
        this.globalAlpha = 1;
        this.countAlpha = 0;
        this.tresholdAlpha = 30;

        this.reduceGlobalAlpha();
    }

    moveBlocks(){
        this.y += this.height;
    }

    reduceGlobalAlpha(){
        let thisObject = this;
        requestAnimationFrame(()=>{
            thisObject.reduceGlobalAlpha();
        })
        this.countAlpha++;
        if(this.countAlpha > this.tresholdAlpha){
            this.countAlpha = 0;
            this.globalAlpha -= 0.1;
            if(this.globalAlpha <= 0){
                this.globalAlpha = 0;
            }
        }
    }

    randomCharacters(){
        return Math.round(Math.random()*128);
    }

    renderBlock(){
        ctx.globalAlpha = this.globalAlpha.toFixed(1);
        ctx.font = "20px Georgia";
        ctx.fillText(String.fromCharCode(this.randomCharacters()), this.x, this.y);
        ctx.fillStyle = "rgb(0,255,0)";
        ctx.shadowColor = "rgba(255,255,255,0.5)";
        ctx.shadowBlur = 0.2;
    }
}

class Game{
    constructor(){
        this.blocks = [];
        this.blockSpaces = [];
        this.blockSpacesLength;
        this.selectedBlockSpace = ''
        this.selectedBlockSpaces = [];
        this.countGameSpeed = 0;
        this.gameSpeedTreshold = 1;
    }
    

    loadBlocks(){
            let blocks = new Blocks();
            blocks.x = this.blockSpaces[this.selectBlockSpaces()];
            this.blocks.push(blocks);    
    }

    defineBlockSpaces(){
        let blocksY = (new Blocks()).width
        for(let i = 0; i < canvas.width; i += blocksY){
            this.blockSpaces.push(i);
        }
        this.blockSpacesLength = this.blockSpaces.length;
    }

    selectBlockSpaces(){
        this.selectedBlockSpace = Math.round(Math.random()*this.blockSpacesLength);
        if(this.selectedBlockSpaces.length < this.blockSpaces.length){
            if(this.selectedBlockSpaces.includes(this.selectedBlockSpace)){
                this.selectBlockSpaces();
            }else{
                this.selectedBlockSpaces.push(this.selectedBlockSpace);
                return this.selectedBlockSpace;
            }
        }
    }

    deleteBlocks(){
        this.blocks.forEach((block, key)=>{
            if(block.y > canvas.height){
                this.blocks.splice(key, 1);
                this.selectedBlockSpaces.splice(key, 1);
            }
        });
    }

    clearCanvas(){
        
        ctx.restore();
        
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        if(this.blocks.length == this.blockSpaces.length-1){
            ctx.clearRect(this.blocks[0].x, this.blocks[0].y, this.blocks[0].width, this.blocks[0].height);
            //ctx.clearRect(0, 0, canvas.width,canvas.height);
        }
    }

    loopGame(){
        let thisObject = this;
        requestAnimationFrame(()=>{
            thisObject.loopGame();
        });
        this.countGameSpeed++;
        
        if(this.countGameSpeed > this.gameSpeedTreshold){
            this.countGameSpeed = 0;
            
            this.deleteBlocks();
            this.clearCanvas();
            this.loadBlocks();
            if(this.blocks.length >= 1){
                this.blocks.forEach((block)=>{
                    block.moveBlocks();
                    block.renderBlock();
                });
            }
        }
    }
}

async function main(){
    let g = new Game();
    await g.defineBlockSpaces();
    await g.loopGame();
}
main();