module.exports = {
  spawnWaveInterval: 30 * 1000, // 30 seconds each creep wave
  spawnInterval: 2.5 * 1000,    // 2.5 seconds each creep inside the wave
  spawnPerWave: 3,              // number of creeps to spawn per wave

  attackInterval: 600,          // time to simulate each attack step
  abandonTimeout: 600,          // units can't battle again for this time after leaving a battle
}
