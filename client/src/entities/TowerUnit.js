import Unit from './Unit.js'

export default class TowerUnit extends PIXI.Container {

  constructor ( options ) {

    super()

    this.side = options.side

    this.tower = PIXI.Sprite.fromImage('tower-white.png')
    this.tower.tint = config.colors[ options.side ]
    this.tower.anchor.set( 0.5 )
    this.tower.x = this.tower.width / 4
    this.tower.y = 20
    this.addChild( this.tower )

    this.unit = new Unit(options)
    this.unit.x = this.tower.width / 4
    this.unit.y = 24
    this.addChild( this.unit )

  }

  get attributes () {
    return this.unit.attributes
  }

  kill () {

    App.tweens.add( this.scale ).to( { x: 0.3, y: 0.3 }, 800, Tweener.ease.quadOut )

    App.tweens.add( this ).to( { alpha: 0 }, 800, Tweener.ease.quadOut ).then( () => {

      this.parent.removeChild( this )

    })

  }

}

