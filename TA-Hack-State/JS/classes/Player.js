class Player{
    constructor({
        collisonBlocks = []
    }){
        this.position = {
            x: 200,
            y: 200
        }

        this.velocity = {
            x:0,
            y: 0
        }

        this.width = 25
        this.height = 25;
        this.sides = {
            bottom: this.position.y + this.height
        }
        this.gravity = 1

        this.collisonBlocks = collisonBlocks
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.position.x += this.velocity.x
        this.checkForHorizontalCollisions()

        this.applyGravity()

        this.checkForVerticalCollisions()
    }

    // check for horizontal collisions
    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisonBlocks.length; i++){
            const collisionBlock = this.collisonBlocks[i]
            
            //if a collison exists
            if (this.position.x <= collisionBlock.position.x + collisionBlock.width && 
                this.position.x + this.width >= collisionBlock.position.x && 
                this.position.y + this.height >= collisionBlock.position.y &&
                this.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                //collision on x axis going to the left
                if (this.velocity.x < 0) {
                    this.position.x = 
                        collisionBlock.position.x + collisionBlock.width + 0.01
                        break
                    }

                if (this.position.x > 1) {
                    this.position.x = collisionBlock.position.x - this.width - 0.01
                    break
                }
            }
        }
    }

    // apply gravity
    applyGravity(){
        this.velocity.y += this.gravity
        this.position.y += this.velocity.y
    }

    //check for vertical collisions
    checkForVerticalCollisions(){
        for (let i = 0; i < this.collisonBlocks.length; i++){
            const collisionBlock = this.collisonBlocks[i]
            
            //if a collison exists
            if (this.position.x <= collisionBlock.position.x + collisionBlock.width && 
                this.position.x + this.width >= collisionBlock.position.x && 
                this.position.y + this.height >= collisionBlock.position.y &&
                this.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                //collision on x axis going to the left
                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    this.position.y = 
                        collisionBlock.position.y + collisionBlock.height + 0.01
                        break
                    }
    
                if (this.position.y > 1) {
                    this.velocity.y = 0
                    this.position.y = collisionBlock.position.y - this.height - 0.01
                    break
                }
            }
        }
    }
}