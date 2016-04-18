const uniqid = require('uniqid')
const config = require('../config.js')

var _units = new WeakMap()
var interval = new WeakMap()
var _state = new WeakMap()

class Battle {

  constructor ( state ) {

    this.id = uniqid()
    this.type = "battle"

    _state.set( this, state )
    interval.set( this, state.clock.setInterval( this.attack.bind( this, state ), config.attackInterval ) )

    this.position = { x: null, y: null }

    this.percentage = 0.5
    this.hp = {}

    this.units = {}

    _units.set(this, [])

  }

  join ( unit ) {

    unit.isBattling = true
    unit.battle = this

    this.units[ unit.id ] = true

    if ( ! this.hp[ unit.side ] ) {

      this.hp[ unit.side ] = unit.defense

    } else {

      this.hp[ unit.side ] += unit.defense
    }


    _units.get( this ).push( unit )

  }

  leave ( unit, isAbandoning ) {

    if ( typeof ( isAbandoning ) === "undefined" ) {
      isAbandoning = false
    }

    unit.isBattling = false

    let arr = _units.get( this )
    arr.splice( arr.indexOf( unit ), 1 )

    delete this.units[ unit.id ]

    if ( isAbandoning ) {
      this.hp[ unit.side ] -= unit.defense
    }

    // skip if there is no items left
    if ( arr.length === 0 ) {
      return
    }

    let side1 = arr[ 0 ].side

    if ( arr.filter(unit => unit.side !== side1).length == 0 ) {

      // other side left
      // leave remaining items and then destroy battle unit

      arr.map(unit => this.leave( unit, false ))
      this.destroy()

    }


  }

  attack ( state ) {

    let units = _units.get( this )

    let side1 = units[ 0 ].side
    let unitsSide1 = units.filter(unit => unit.side === side1)

    let unitsSide2 = units.filter(unit => unit.side !== side1)
    let side2 = unitsSide2[ 0 ].side

    //
    // TODO: process "first-strike"
    //

    this.hp[ side1 ] -= this.getUnitsAttribute ( unitsSide2, 'attack' )
    this.hp[ side2 ] -= this.getUnitsAttribute ( unitsSide1, 'attack' )

    let side1Percent = this.hp[ side1 ] / this.getUnitsAttribute ( unitsSide1, 'defense' )
    let side2Percent = this.hp[ side2 ] / this.getUnitsAttribute ( unitsSide2, 'defense' )

    this.percentage = ( side1Percent + side2Percent ) / 2

    if ( this.hp[ side1 ] < 0 ) {
      unitsSide1.map( unit => state.removeEntity ( unit ))
      unitsSide2.map( unit => this.leave( unit ) )
      this.destroy()
    }

    if ( this.hp[ side2 ] < 0 ) {
      unitsSide2.map( unit => state.removeEntity ( unit ))
      unitsSide1.map( unit => this.leave( unit ) )
      this.destroy()
    }

  }

  destroy (  ) {
    _state.get( this ).removeEntity ( this )
    interval.get( this ).clear()
  }

  getUnitsAttribute ( units, attribute ) {

    return units.reduce( (previousValue, currentUnit, currentIndex) => {
      return previousValue + currentUnit[ attribute ]
    } , 0)

  }

  // toJSON () {
  // }

}

module.exports = Battle
