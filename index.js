var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

class Blocks{
    constructor(space = 0, keySpace){
        this.width = 10;
        this.height = 10;
        this.x = space[keySpace];
        this.y = 0;
        this.blockSpeed = this.height/2;
        this.characterTurn;
        this.blockSpace = space;
        this.character = this.returnChar();
        this.countCharSpeed = 10;
        this.moveBlocks();
        this.changeText();
    }

    createBlocks(){
        
        ctx.font = "30px Arial";
        ctx.fillStyle="white";
        ctx.fillText(this.character, this.x, this.y/2);
    }

    moveBlocks(){
        this.y += this.blockSpeed;
    }

    returnChar(){
        return String.fromCharCode(Math.round(Math.random()*128))
    }

    changeText(){
        let thisObject = this;

        requestAnimationFrame(()=>{
            thisObject.changeText();
        });

        if(this.countCharSpeed > 10){
            this.countCharSpeed = 0;
            this.character = this.returnChar();
        }

        this.countCharSpeed++;
    }
}

class matrix{
    constructor(){
        this.blocks = [];
        this.countToCreateBlocks = 0;
        this.countThreshold = 10;
        this.blockSpace = [];
        this.blockSpaceKey = Math.round(Math.random()*((canvas.width/100)));
    }
    /* puxa os blocos para um array */
    createBlocks(){
        for(let i = 0; i < 10; i++){
            let element = new Blocks(this.blockSpace, this.blockSpaceKey);
            element.y = element.y=-50 * i;
            this.blocks.push(element);
        }
    }
    /* escolhe um index de referencia para o posicionamento x */
    pickSpaceBlocks(){
        
            this.blockSpaceKey = Math.round(Math.random()*this.blockSpace.length);
        
    }

    /* monta um array com spaços fixos com baseno tamanho dos blocos */
    defineBlockSpace(){
        for(let i = 0; i < canvas.width; i+=(new Blocks).width){
            this.blockSpace.push(i);
        }
    }

    /* loop da classe para animar os blocos */
    loopMatrix(){
        requestAnimationFrame(()=>{
            this.loopMatrix();
        });
        this.pickSpaceBlocks();
        this.clearCanvas();
        this.deleteBlocks();

        this.blocks.forEach((block, key)=>{
            block.createBlocks();
            block.moveBlocks();
        });
        
        if(this.countToCreateBlocks > this.countThreshold){
            this.countToCreateBlocks = 0;
            this.createBlocks();
        }
        this.countToCreateBlocks++;
    }

    clearCanvas(){
        //ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.beginPath();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        
        ctx.stroke();
        
    }

    deleteBlocks(){
        this.blocks.forEach((block, key)=>{
            if(block.y > canvas.height){
                this.blocks.splice(key, 0);
            }
        })
    }
}

async function main(){
    let m = new matrix();
    await m.defineBlockSpace();
    await m.pickSpaceBlocks();
    m.loopMatrix();
}
main();

