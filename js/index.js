var bird = {
  skyPositionX: 0,
  skyMoveSpeed: 2,
  birdTop: 220,
  startClass: 'blue',
  birdPosition: 0,
  animateFlage: false,
  minTop: 0,
  maxTop: 570,
  birdDropSpeed: 0,
  pipeLength: 7,
  pipeArr: [],
  lastIndex: 6,
  score: 0,
  gameResults: [],
  initData() {
    this.oGame = document.querySelector('#bird-game')
    this.oBird = this.oGame.querySelector('#bird-game .bird')
    this.oStart = this.oGame.querySelector('#bird-game .start')
    this.oScore = this.oGame.querySelector('#bird-game .score')
    this.oFail = this.oGame.querySelector('#bird-game .fail')
    this.oFinalScore = this.oGame.querySelector('.fail .final-score')
    this.oRank = this.oGame.querySelector('.rank')
    this.oRestart = this.oGame.querySelector('.restart')
  },
  animate() {
    var count = 0
    this.timer = setInterval(() => {
      count++
      if (this.animateFlage) {
        this.birdDrop()
        this.pipeMove()
      }
      if (count % 10 === 0) {
        if (!this.animateFlage) {
          this.birdJump()
          this.startTwinkle()
        }
        this.birdFly(count)
      }
      this.skyMove()
    }, 30)
  },
  // 小鸟自己跳
  birdJump() {
    this.birdTop = this.birdTop === 220 ? 260 : 220
    this.oBird.style.top = this.birdTop + 'px'
  },
  // 天空移动
  skyMove() {
    this.skyPositionX -= this.skyMoveSpeed
    this.oGame.style.backgroundPositionX = this.skyPositionX + 'px'
  },
  // 开始游戏闪烁
  startTwinkle() {
    this.oStart.classList.remove("start-" + this.startClass)
    this.startClass = this.startClass === 'blue' ? 'white' : 'blue'
    this.oStart.classList.add('start-' + this.startClass)
  },
  // 小鸟飞
  birdFly(count) {
    this.birdPosition = (count % 3) * 30
    this.oBird.style.backgroundPositionX = - this.birdPosition + 'px'
  },
  handleEvent() {
    this.startClick()
    this.restartClick()
  },
  // 点击开始
  startClick() {
    this.oStart.onclick = this.start.bind(this)
  },

  start() {
    this.animateFlage = true
    this.oScore.style.display = 'block'
    this.oStart.style.display = 'none'
    this.oBird.style.transition = 'none'
    this.oBird.style.left = '80px'
    this.skyMoveSpeed = 5
    this.createPipe()
    this.birdClickUp()
  },
  // 点击之后小鸟自然下坠
  birdDrop() {
    this.birdTop += ++this.birdDropSpeed
    this.oBird.style.top = this.birdTop + 'px'
    this.crashTest()
    this.addScore()

  },
  // 碰撞检测
  crashTest() {
    this.crashGameBound()
    this.crashPipe()
  },
  // 小鸟碰到上下边的检测
  crashGameBound() {
    if (this.birdTop > this.maxTop || this.birdTop < this.minTop) {
      this.failGame()
    }
  },
  // 小鸟碰到管子的检测
  crashPipe() {
    var index = this.score % this.pipeLength
    var pipeLeftCrash = this.pipeArr[index].up.offsetLeft
    var minCrashTop = this.pipeArr[index].up.offsetHeight
    var maxCrashTop = minCrashTop + 150 - 30
    if (pipeLeftCrash > 13 && pipeLeftCrash < 95 && (this.birdTop < minCrashTop || this.birdTop > maxCrashTop)) {
      this.failGame()
    }
  },
  // 每成功穿过一对柱子就加分
  addScore() {
    var index = this.score % this.pipeLength
    if (this.pipeArr[index].up.offsetLeft < -13) {
      this.score++
      this.oScore.innerText = this.score
    }
  },
  // 点击重新开始游戏
  restartClick() {
    this.oRestart.onclick = () => {
      window.sessionStorage.setItem('play', true)
      window.location.reload()
    }
  },
  // 游戏结束
  failGame() {
    clearInterval(this.timer)
    this.oBird.style.display = 'none'
    this.oScore.style.display = 'none'
    this.oFail.style.display = 'block'
    this.oFinalScore.innerText = this.score
    this.getGameResults()
    this.createResulet()
  },
  // 生成柱子
  createPipe() {
    for (let i = 0; i < this.pipeLength; i++) {
      // 计算柱子的高度
      var pipeUpHeight = Math.floor(Math.random() * 175 + 50),
        pipeDownHeight = 600 - 150 - pipeUpHeight
      var pipeUp = createElement('div', ['pipe', 'pipe-up'], {
        height: pipeUpHeight + 'px',
        left: 300 * (i + 1) + 'px'
      })
      var pipeDown = createElement('div', ['pipe', 'pipe-down'], {
        height: pipeDownHeight + 'px',
        left: 300 * (i + 1) + 'px'
      })
      this.oGame.appendChild(pipeUp)
      this.oGame.appendChild(pipeDown)
      this.pipeArr.push({
        up: pipeUp,
        down: pipeDown
      })
    }
  },
  createPipeUpDown() {
    var pipeUpHeight = Math.floor(Math.random() * 175 + 50),
      pipeDownHeight = 600 - 150 - pipeUpHeight
    return {
      up: pipeUpHeight,
      down: pipeDownHeight
    }
  },
  // 柱子移动
  pipeMove() {
    for (let i = 0; i < this.pipeLength; i++) {
      let pipeLeft = this.pipeArr[i].up.offsetLeft
      let upPipe = this.pipeArr[i].up
      let downPipe = this.pipeArr[i].down
      pipeLeft -= this.skyMoveSpeed
      if (pipeLeft < -52) {
        upPipe.style.left = this.pipeArr[this.lastIndex].up.offsetLeft + 300 + 'px'
        downPipe.style.left = this.pipeArr[this.lastIndex].up.offsetLeft + 300 + 'px'
        let pipeNew = this.createPipeUpDown()
        upPipe.style.height = pipeNew.up + 'px'
        downPipe.style.height = pipeNew.down + 'px'
        this.lastIndex = ++this.lastIndex % 7
        // 跳出循环
        continue
      }
      upPipe.style.left = pipeLeft + 'px'
      downPipe.style.left = pipeLeft + 'px'
    }
  },
  // 点击屏幕小鸟往上移动
  birdClickUp() {
    this.oGame.onclick = (e) => {
      if (!e.target.classList.contains('start')) {
        this.birdDropSpeed = -10
      }
    }
  },
  getGameResults() {
    var date = new Date()
    var datailTime = formatDate(date)
    var finalScore = this.score
    var gameResult = {
      date: datailTime,
      score: finalScore
    }
    var record = window.getLocalStorage('record')
    record = record? record : []
    record.push(gameResult)
    record = record.sort((a, b) => {
      return b.score - a.score
    })
    if (record.length > 8) {
      record = record.slice(0, 8)
    }
    setLocalStorage('record', record)
  },
  createResulet() {
    var record = getLocalStorage('record')
    var template = ''
    for (let i = 0; i < record.length; i++) {
      template += ` <p class="rank-item">
      <span class="rank-degree">${i + 1}</span>
      <span class="final-score">${record[i].score}</span>
      <span>${record[i].date}</span>
    </p>`
    }
    this.oRank.innerHTML = template
  },
  init() {
    this.initData()
    this.handleEvent()
    this.animate()
    if (sessionStorage.getItem('play')) {
      this.start()
    }
  }
}

bird.init()