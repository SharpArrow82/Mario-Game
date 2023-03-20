//Images Query Set
import platform from '../img/Platform.png'
import background from '../img/background.png'
import hills from '../img/hills.png'
import platformSmallTall from '../img/platformSmallTall.png'
import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'

function createImage(imageSrc){
    const image = new Image();
    image.src = imageSrc
    return image
}

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.5

let imagePlatform = createImage(platform)
let imagePlatformTall = createImage(platformSmallTall)

class Player {
    constructor(){
        this.speed = 8  //Player Speed
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30
    }
    draw() {
        c.fillStyle = 'purple';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    

    update()
    {
        this.draw()
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        //else this.velocity.y = 0
    }
}

class Platform {
    constructor({x, y, image}){
        this.position = {
            x,
            y
        }
        this.image = imagePlatformTall
        this.width = this.image.width
        this.height = 20
        
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
        //c.fillStyle = 'blue'
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        
    }
}

class genericObject {
    constructor({x, y, image}){
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = this.image.width
        this.height = 20
        
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
        //c.fillStyle = 'blue'
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        
    }
}


/////////////every problem starts here
let genericObjects = [
    
]

let player = new Player();
//const platform = new Platform();
let platforms = [
    
];
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0

function init(){
    imagePlatform = createImage(platform)
    imagePlatformTall = createImage(platformSmallTall)

    genericObjects = [
        new genericObject({
            x: 0,
            y: 0,
            image: createImage(background)
        }),
        new genericObject({
            x: 0,
            y: 60,
            image: createImage(hills)
        })
    ]
    
    player = new Player();
    //const platform = new Platform();
    platforms = [
        new Platform({x:-1, y:640, imagePlatform}), 
        new Platform({x:imagePlatform.width -1, y:640, imagePlatform}), 
        new Platform({x:(imagePlatform.width*2) - 1, y:640, imagePlatform}),
        new Platform({x:(imagePlatform.width*3) + 100, y:630, imagePlatform}),
        new Platform({x:(imagePlatformTall.width*2) + 300, y:430, imagePlatformTall})
    ];
    
    
    scrollOffset = 0
}

function animate()
{
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.clearRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })

    platforms.forEach(platform => {
        platform.draw()    
    })
    
    player.update()
    
    if(keys.right.pressed && player.position.x < 500) {
        player.velocity.x = player.speed
    } 
    else if(keys.left.pressed && player.position.x > 200) {
        player.velocity.x = -player.speed
    }     
    else {
        player.velocity.x = 0
        if(keys.right.pressed)
        {
            scrollOffset += 5
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * 0.66
            })
            
        }
        else if(keys.left.pressed)
        {
            scrollOffset -= 5
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * 0.66
            })
        }
    }
    //platform collision detection
    platforms.forEach(platform => {
    if(player.position.y + player.height <= platform.position.y && 
        player.position.y + player.height + player.velocity.y > platform.position.y &&
        player.position.x + player.width >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width){
        player.velocity.y = 0
        }
    })

    //Win condition
    if(scrollOffset >= 2000)
    {
        console.log('You Won')
    }

    //Lose Condition
    if(player.position.y > canvas.height)
    {
        console.log('you lose')
        init()
    }
}

init()
animate()


addEventListener('keydown', ({ keyCode }) => {
switch(keyCode)
{
    case 65:
        console.log('Left')
        keys.left.pressed = true
        break;
    case 83:
        console.log('Down')
        if(player.position.y + player.height + player.velocity.y < canvas.height)
        {
            player.velocity.y += 20
        }
        break;
    case 68:
        console.log('Right')
        keys.right.pressed = true
        break;
    case 87:
        console.log('Up')
        player.velocity.y -= 10
        break;

}
})


addEventListener('keyup', ({ keyCode }) => {
    switch(keyCode)
    {
        case 65:
            console.log('Left')
            keys.left.pressed = false
            break;
        case 83:
            console.log('Down')
            if(player.position.y + player.height + player.velocity.y < canvas.height)
            {
                player.velocity.y += 20
            }
            break;
        case 68:
            console.log('Right')
            keys.right.pressed = false
            player.velocity.x = 0
            break;
        case 87:
            console.log('Up')
            player.velocity.y -= 10
            break;
    
    }
    })
