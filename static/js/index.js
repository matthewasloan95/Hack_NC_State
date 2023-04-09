const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 64 * 16 // 1024
canvas.height = 64 * 9 // 576

let parsedCollisions
let collisionBlocks
let background
let doors
    const player = new Player({
    imageSrc: '../static/img/king/pdIdle.png',
    frameRate: 11,
    animations: {
        idleRight: {
        frameRate: 11,
        frameBuffer: 6,
        loop: true,
        imageSrc: '../static/img/king/pdIdle.png',
        },
        idleLeft: {
        frameRate: 11,
        frameBuffer: 6,
        loop: true,
        imageSrc: '../static/img/king/pdIdleLeft.png',
        },
        runRight: {
        frameRate: 8,
        frameBuffer: 7,
        loop: true,
        imageSrc: '../static/img/king/pdRunRight.png',
        },
        runLeft: {
        frameRate: 8,
        frameBuffer: 7,
        loop: true,
        imageSrc: '../static/img/king/pdRunLeft.png',
        },
        enterDoor: {
        frameRate: 8,
        frameBuffer: 7,
        loop: false,
        imageSrc: '../static/img/king/pdEnterDoor.png',
        onComplete: () => {
            console.log('completed animation')
            gsap.to(overlay, {
            opacity: 1,
            onComplete: () => {
                level++

                //remove later
                if (level === 4) level = 1
                levels[level].init()
                player.switchSprite('idleRight')
                player.preventInput = false
                gsap.to(overlay, {
                opacity: 0,
                })
            },
            })
        },
        },
    },
})

let level = 1
let levels = {
    1: {
        init: () => {
        parsedCollisions = collisionsLevel1.parse2D()
        collisionBlocks = parsedCollisions.createObjectsFrom2D()
        player.collisionBlocks = collisionBlocks
        if (player.currentAnimation) player.currentAnimation.isActive = false

        background = new Sprite({
            position: {
            x: 0,
            y: 0,
            },
            imageSrc: '../static/img/backgroundLevel1.png',
        })

        doors = [
            new Sprite({
            position: {
                x: 767,
                y: 290,
            },
            imageSrc: '../static/img/doorOpen.png',
            frameRate: 5,
            frameBuffer: 5,
            loop: false,
            autoplay: false,
            }),
        ]
        },
    },
    2: {
        init: () => {
        parsedCollisions = collisionsLevel2.parse2D()
        collisionBlocks = parsedCollisions.createObjectsFrom2D()
        player.collisionBlocks = collisionBlocks
        player.position.x = 96
        player.position.y = 140

        if (player.currentAnimation) player.currentAnimation.isActive = false

        background = new Sprite({
            position: {
            x: 0,
            y: 0,
            },
            imageSrc: '../static/img/backgroundLevel2.png',
        })

        doors = [
            new Sprite({
            position: {
                x: 772.0,
                y: 350,
            },
            imageSrc: '../static/img/doorOpen.png',
            frameRate: 5,
            frameBuffer: 5,
            loop: false,
            autoplay: false,
            }),
        ]
        },
    },
    3: {
        init: () => {
        parsedCollisions = collisionsLevel3.parse2D()
        collisionBlocks = parsedCollisions.createObjectsFrom2D()
        player.collisionBlocks = collisionBlocks
        player.position.x = 750
        player.position.y = 230
        if (player.currentAnimation) player.currentAnimation.isActive = false

        background = new Sprite({
            position: {
            x: 0,
            y: 0,
            },
            imageSrc: '../static/img/backgroundLevel3.png',
        })

        doors = [
            new Sprite({
            position: {
                x: 176.0,
                y: 350,
            },
            imageSrc: '../static/img/doorOpen.png',
            frameRate: 5,
            frameBuffer: 5,
            loop: false,
            autoplay: false,
            }),
        ]
        },
    },
}

const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

const overlay = {
    opacity: 0,
}

function animate() {
    window.requestAnimationFrame(animate)

    background.draw()
    // collisionBlocks.forEach((collisionBlock) => {
    //   collisionBlock.draw()
    // })

    doors.forEach((door) => {
        door.draw()
    })

    player.handleInput(keys)
    player.draw()
    player.update()

    c.save()
    c.globalAlpha = overlay.opacity
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.restore()
}

levels[level].init()
animate()