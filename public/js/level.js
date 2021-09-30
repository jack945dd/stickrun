class Level{
    constructor(){
        this.chunks = [];
        this.chunk_index = 0;
    }
    append(chunk){
        this.chunks.push(chunk);
    }
    trim(index){
        for(let i=0; i<this.chunks[index].data.length; i++){
            World.remove(engine.world, this.chunks[index].data[i]);
        }
        this.chunks[index].data.length = 0;
        this.chunk_index = ++index;
    }
    draw(){
        for(var i=this.chunk_index; i<this.chunks.length; i++)
            this.chunks[i].draw();
    }
}
