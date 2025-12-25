// 圣诞节礼物收集游戏
class ChristmasGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.santa = document.getElementById('santa');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.timerElement = document.getElementById('timer');
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        
        // 新增元素
        this.userSetup = document.getElementById('userSetup');
        this.leaderboard = document.getElementById('leaderboard');
        this.playerNameDisplay = document.getElementById('playerNameDisplay');
        this.playerIconElement = document.getElementById('playerIcon');
        this.playerNameElement = document.getElementById('playerName');
        
        this.gameState = 'setup'; // setup, menu, playing, gameOver, leaderboard
        this.score = 0;
        this.lives = 3;
        this.timeLeft = 60;
        this.santaPos = { x: 50, y: 50 };
        this.gifts = [];
        this.obstacles = [];
        this.keys = {};
        
        // 玩家信息
        this.playerName = '';
        this.playerIcon = '🎅';
        this.selectedCharacter = '';
        this.leaderboardData = [];
        
        // 可选角色
        this.characters = ['🎅', '🤶', '🧑‍🎄', '⛄', '🦌', '🧝'];
        
        // 等级系统
        this.rankThresholds = {
            god: 2000,    // 人上人
            heng: 1500,   // 奃
            top: 1000,    // 顶级
            npc: 0        // NPC
        };
        
        // DDL障碍物列表
        this.ddlObstacles = [
            '期末考试DDL',
            '英语 pre DDL',
            '四六级DDL',
            '组会DDL',
            '市场调研DDL',
            'PPT提交DDL',
            '答辩DDL',
            '论文DDL',
            '秋招DDL',
            '作业提交DDL',
            '实验报告DDL',
            '毕业设计DDL'
        ];
        
        this.gameAreaWidth = 0;
        this.gameAreaHeight = 0;
        
        this.init();
    }
    
    init() {
        this.updateGameAreaSize();
        this.createSnowEffect();
        this.bindEvents();
        this.resetSantaPosition();
        this.loadLeaderboard();
        
        // 窗口大小改变时更新游戏区域大小
        window.addEventListener('resize', () => {
            this.updateGameAreaSize();
        });
        
        // 初始化角色选择
        this.initCharacterSelection();
    }
    
    updateGameAreaSize() {
        const rect = this.gameArea.getBoundingClientRect();
        this.gameAreaWidth = rect.width;
        this.gameAreaHeight = rect.height;
    }
    
    bindEvents() {
        // 确认设置按钮
        document.getElementById('confirmSetupBtn').addEventListener('click', () => {
            this.confirmSetup();
        });
        
        // 开始按钮
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // 重新开始按钮
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        // 排行榜相关按钮
        document.getElementById('leaderboardBtn').addEventListener('click', () => {
            this.showLeaderboard();
        });
        document.getElementById('viewLeaderboardBtn').addEventListener('click', () => {
            this.showLeaderboard();
        });
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.backToMenu();
        });
        
        // 返回设置按钮
        document.getElementById('backToSetupBtn').addEventListener('click', () => {
            this.backToSetup();
        });
        
        // 祝福提交按钮
        document.getElementById('submitBlessingBtn').addEventListener('click', () => {
            this.submitBlessing();
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            e.preventDefault();
        });
        
        // 手机端触摸支持
        this.addTouchControls();
        
        // 防止右键菜单
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    initCharacterSelection() {
        const characterOptions = document.querySelectorAll('.character-option');
        
        // 默认选择第一个角色
        characterOptions[0].classList.add('selected');
        this.selectedCharacter = characterOptions[0].dataset.icon;
        
        characterOptions.forEach(option => {
            option.addEventListener('click', () => {
                // 移除所有选中状态
                characterOptions.forEach(opt => opt.classList.remove('selected'));
                // 添加选中状态
                option.classList.add('selected');
                this.selectedCharacter = option.dataset.icon;
            });
        });
    }
    
    confirmSetup() {
        const nicknameInput = document.getElementById('nicknameInput');
        const nickname = nicknameInput.value.trim();
        
        if (!nickname) {
            alert('请输入昵称!');
            return;
        }
        
        if (!this.selectedCharacter) {
            alert('请选择角色!');
            return;
        }
        
        this.playerName = nickname;
        this.playerIcon = this.selectedCharacter;
        
        // 更新界面显示
        this.updatePlayerDisplay();
        
        // 进入菜单界面
        this.gameState = 'menu';
        this.userSetup.style.display = 'none';
        this.startScreen.style.display = 'block';
    }
    
    updatePlayerDisplay() {
        // 更新头部显示
        this.playerIconElement.textContent = this.playerIcon;
        this.playerNameElement.textContent = this.playerName;
        
        // 更新游戏中的角色
        this.santa.textContent = this.playerIcon;
        
        // 更新游戏结束界面
        document.getElementById('finalPlayerIcon').textContent = this.playerIcon;
        document.getElementById('finalPlayerName').textContent = this.playerName;
        
        // 显示玩家名称
        this.updatePlayerNamePosition();
    }
    
    updatePlayerNamePosition() {
        const santaRect = this.santa.getBoundingClientRect();
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        
        this.playerNameDisplay.textContent = this.playerName;
        this.playerNameDisplay.style.left = (this.santaPos.x + 20) + 'px';
        this.playerNameDisplay.style.top = (this.santaPos.y - 15) + 'px';
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.timeLeft = 60;
        this.gifts = [];
        this.obstacles = [];
        
        this.startScreen.style.display = 'none';
        this.gameOverScreen.style.display = 'none';
        this.leaderboard.style.display = 'none';
        
        // 显示游戏元素
        this.santa.style.display = 'block';
        this.playerNameDisplay.style.display = 'block';
        
        this.resetSantaPosition();
        this.updateUI();
        this.updatePlayerNamePosition();
        
        // 开始游戏循环
        this.gameLoop = setInterval(() => this.update(), 50);
        
        // 开始生成物品
        this.giftSpawner = setInterval(() => this.spawnGift(), 1500);
        this.obstacleSpawner = setInterval(() => this.spawnObstacle(), 2000);
        
        // 开始计时
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateUI();
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.handleInput();
        this.moveItems();
        this.checkCollisions();
        this.updateUI();
        this.updatePlayerNamePosition();
    }
    
    handleInput() {
        const speed = 8;
        let newX = this.santaPos.x;
        let newY = this.santaPos.y;
        
        // WASD 或方向键控制
        if (this.keys['a'] || this.keys['arrowleft']) {
            newX = Math.max(0, newX - speed);
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            newX = Math.min(this.gameAreaWidth - 40, newX + speed);
        }
        if (this.keys['w'] || this.keys['arrowup']) {
            newY = Math.max(0, newY - speed);
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            newY = Math.min(this.gameAreaHeight - 40, newY + speed);
        }
        
        this.santaPos.x = newX;
        this.santaPos.y = newY;
        
        this.santa.style.left = this.santaPos.x + 'px';
        this.santa.style.top = this.santaPos.y + 'px';
    }
    
    spawnGift() {
        if (this.gameState !== 'playing') return;
        
        const gift = document.createElement('div');
        gift.className = 'gift';
        gift.textContent = '🎁';
        gift.style.left = Math.random() * (this.gameAreaWidth - 30) + 'px';
        gift.style.top = Math.random() * (this.gameAreaHeight - 30) + 'px';
        
        this.gameArea.appendChild(gift);
        this.gifts.push({
            element: gift,
            x: parseInt(gift.style.left),
            y: parseInt(gift.style.top),
            collected: false
        });
        
        // 5秒后自动移除未收集的礼物
        setTimeout(() => {
            if (gift.parentNode) {
                gift.parentNode.removeChild(gift);
                this.gifts = this.gifts.filter(g => g.element !== gift);
            }
        }, 5000);
    }
    
    spawnObstacle() {
        if (this.gameState !== 'playing') return;
        
        const obstacle = document.createElement('div');
        obstacle.className = 'ddl-obstacle';
        
        // 随机选择DDL类型
        const ddlText = this.ddlObstacles[Math.floor(Math.random() * this.ddlObstacles.length)];
        obstacle.textContent = ddlText;
        
        obstacle.style.left = Math.random() * (this.gameAreaWidth - 100) + 'px';
        obstacle.style.top = Math.random() * (this.gameAreaHeight - 40) + 'px';
        
        this.gameArea.appendChild(obstacle);
        this.obstacles.push({
            element: obstacle,
            x: parseInt(obstacle.style.left),
            y: parseInt(obstacle.style.top)
        });
        
        // 8秒后自动移除障碍物
        setTimeout(() => {
            if (obstacle.parentNode) {
                obstacle.parentNode.removeChild(obstacle);
                this.obstacles = this.obstacles.filter(o => o.element !== obstacle);
            }
        }, 8000);
    }
    
    moveItems() {
        // 礼物轻微移动效果
        this.gifts.forEach(gift => {
            if (!gift.collected) {
                gift.y += Math.sin(Date.now() * 0.003) * 0.5;
                gift.element.style.top = gift.y + 'px';
            }
        });
    }
    
    checkCollisions() {
        // 检查礼物碰撞
        this.gifts.forEach((gift, index) => {
            if (gift.collected) return;
            
            if (this.isColliding(this.santaPos, { x: gift.x, y: gift.y })) {
                this.collectGift(gift, index);
            }
        });
        
        // 检查障碍物碰撞
        this.obstacles.forEach((obstacle, index) => {
            if (this.isColliding(this.santaPos, { x: obstacle.x, y: obstacle.y })) {
                this.hitObstacle(obstacle, index);
            }
        });
    }
    
    isColliding(pos1, pos2) {
        const distance = Math.sqrt(
            Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
        );
        return distance < 35;
    }
    
    collectGift(gift, index) {
        gift.collected = true;
        this.score += 100;
        
        // 创建收集特效
        this.createParticles(gift.x + 15, gift.y + 15, '#4ecdc4');
        
        // 移除礼物
        gift.element.parentNode.removeChild(gift.element);
        this.gifts.splice(index, 1);
        
        // 播放音效 (如果有)
        this.playSound('collect');
    }
    
    hitObstacle(obstacle, index) {
        this.lives--;
        
        // 创建撞击特效
        this.createParticles(this.santaPos.x + 20, this.santaPos.y + 20, '#ff4757');
        
        // 移除障碍物
        obstacle.element.parentNode.removeChild(obstacle.element);
        this.obstacles.splice(index, 1);
        
        // 播放音效 (如果有)
        this.playSound('hit');
        
        if (this.lives <= 0) {
            this.endGame();
        }
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = color;
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            this.gameArea.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    calculateRank(score) {
        if (score >= this.rankThresholds.god) return '人上人';
        if (score >= this.rankThresholds.heng) return '奃';
        if (score >= this.rankThresholds.top) return '顶级';
        return 'NPC';
    }
    
    getRankClass(rank) {
        switch(rank) {
            case '人上人': return 'god';
            case '夯': return 'heng';
            case '顶级': return 'top';
            case 'NPC': return 'npc';
            default: return 'npc';
        }
    }
    
    playSound(type) {
        // 简单的音效提示，可以后续添加真实音效
        if (type === 'collect') {
            console.log('🎵 收集音效');
        } else if (type === 'hit') {
            console.log('💥 撞击音效');
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
        this.timerElement.textContent = this.timeLeft;
    }
    
    endGame() {
        this.gameState = 'gameOver';
        
        // 清除定时器
        clearInterval(this.gameLoop);
        clearInterval(this.giftSpawner);
        clearInterval(this.obstacleSpawner);
        clearInterval(this.timer);
        
        // 清除所有物品
        this.gifts.forEach(gift => {
            if (gift.element.parentNode) {
                gift.element.parentNode.removeChild(gift.element);
            }
        });
        this.obstacles.forEach(obstacle => {
            if (obstacle.element.parentNode) {
                obstacle.element.parentNode.removeChild(obstacle.element);
            }
        });
        
        this.gifts = [];
        this.obstacles = [];
        
        // 隐藏游戏元素
        this.santa.style.display = 'none';
        this.playerNameDisplay.style.display = 'none';
        
        // 保存成绩到排行榜
        this.saveToLeaderboard();
        
        // 显示游戏结束界面
        this.finalScoreElement.textContent = this.score;
        const rank = this.calculateRank(this.score);
        document.getElementById('playerRank').textContent = rank;
        document.getElementById('playerRank').className = 'rank-badge ' + this.getRankClass(rank);
        
        this.gameOverScreen.style.display = 'block';
    }
    
    restartGame() {
        this.gameState = 'menu';
        this.gameOverScreen.style.display = 'none';
        this.leaderboard.style.display = 'none';
        this.startScreen.style.display = 'block';
        
        // 隐藏游戏元素
        this.santa.style.display = 'none';
        this.playerNameDisplay.style.display = 'none';
        
        this.resetSantaPosition();
    }
    
    resetSantaPosition() {
        this.santaPos = { 
            x: this.gameAreaWidth / 2 - 20, 
            y: this.gameAreaHeight / 2 - 20 
        };
        this.santa.style.left = this.santaPos.x + 'px';
        this.santa.style.top = this.santaPos.y + 'px';
    }
    
    // 排行榜相关方法
    loadLeaderboard() {
        const saved = localStorage.getItem('christmasGameLeaderboard');
        if (saved) {
            this.leaderboardData = JSON.parse(saved);
        } else {
            this.leaderboardData = [];
        }
    }
    
    saveToLeaderboard() {
        const gameRecord = {
            name: this.playerName,
            icon: this.playerIcon,
            score: this.score,
            rank: this.calculateRank(this.score),
            date: new Date().toISOString()
        };
        
        this.leaderboardData.push(gameRecord);
        
        // 按分数排序并只保留前20名
        this.leaderboardData.sort((a, b) => b.score - a.score);
        this.leaderboardData = this.leaderboardData.slice(0, 20);
        
        localStorage.setItem('christmasGameLeaderboard', JSON.stringify(this.leaderboardData));
    }
    
    showLeaderboard() {
        this.gameState = 'leaderboard';
        this.startScreen.style.display = 'none';
        this.gameOverScreen.style.display = 'none';
        this.leaderboard.style.display = 'block';
        
        // 隐藏游戏元素
        this.santa.style.display = 'none';
        this.playerNameDisplay.style.display = 'none';
        
        this.renderLeaderboard();
    }
    
    renderLeaderboard() {
        const leaderboardList = document.getElementById('leaderboardList');
        
        if (this.leaderboardData.length === 0) {
            leaderboardList.innerHTML = '<p style="text-align: center; color: #ccc; margin: 40px 0;">暂无游戏记录</p>';
        } else {
            leaderboardList.innerHTML = '';
            
            this.leaderboardData.forEach((record, index) => {
                const item = document.createElement('div');
                item.className = `leaderboard-item ${index < 3 ? `rank-${index + 1}` : ''}`;
                
                const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                
                item.innerHTML = `
                    <div class="rank-number">${rankEmoji || (index + 1)}</div>
                    <div class="player-info-board">
                        <span class="player-icon">${record.icon}</span>
                        <span class="player-name">${record.name}</span>
                    </div>
                    <div class="score-info">
                        <div class="score-value">${record.score}</div>
                        <div class="rank-badge ${this.getRankClass(record.rank)}">${record.rank}</div>
                    </div>
                `;
                
                leaderboardList.appendChild(item);
            });
        }
        
        // 显示祝福
        this.loadAndDisplayBlessings();
    }
    
    backToMenu() {
        this.gameState = 'menu';
        this.leaderboard.style.display = 'none';
        this.startScreen.style.display = 'block';
        
        // 隐藏游戏元素
        this.santa.style.display = 'none';
        this.playerNameDisplay.style.display = 'none';
    }
    
    backToSetup() {
        this.gameState = 'setup';
        this.startScreen.style.display = 'none';
        this.userSetup.style.display = 'block';
        
        // 预填当前设置
        const nicknameInput = document.getElementById('nicknameInput');
        nicknameInput.value = this.playerName;
        
        // 选中当前角色
        const characterOptions = document.querySelectorAll('.character-option');
        characterOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.icon === this.playerIcon) {
                option.classList.add('selected');
                this.selectedCharacter = this.playerIcon;
            }
        });
    }
    
    // 手机端触摸控制
    addTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        // 触摸开始
        this.gameArea.addEventListener('touchstart', (e) => {
            if (this.gameState !== 'playing') return;
            e.preventDefault();
            
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });
        
        // 触摸移动
        this.gameArea.addEventListener('touchmove', (e) => {
            if (this.gameState !== 'playing') return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const gameAreaRect = this.gameArea.getBoundingClientRect();
            
            // 直接移动到触摸位置
            const newX = Math.max(0, Math.min(this.gameAreaWidth - 40, touch.clientX - gameAreaRect.left - 20));
            const newY = Math.max(0, Math.min(this.gameAreaHeight - 40, touch.clientY - gameAreaRect.top - 20));
            
            this.santaPos.x = newX;
            this.santaPos.y = newY;
            
            this.santa.style.left = this.santaPos.x + 'px';
            this.santa.style.top = this.santaPos.y + 'px';
        });
        
        // 触摸结束 - 滑动手势识别
        this.gameArea.addEventListener('touchend', (e) => {
            if (this.gameState !== 'playing') return;
            e.preventDefault();
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
        });
        
        // 阻止页面滚动
        document.body.addEventListener('touchstart', (e) => {
            if (e.target.closest('.game-area') && this.gameState === 'playing') {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.body.addEventListener('touchmove', (e) => {
            if (e.target.closest('.game-area') && this.gameState === 'playing') {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // 滑动手势处理
    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 30;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 水平滑动
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // 向右滑动
                    this.keys['d'] = true;
                    setTimeout(() => this.keys['d'] = false, 200);
                } else {
                    // 向左滑动
                    this.keys['a'] = true;
                    setTimeout(() => this.keys['a'] = false, 200);
                }
            }
        } else {
            // 垂直滑动
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0) {
                    // 向下滑动
                    this.keys['s'] = true;
                    setTimeout(() => this.keys['s'] = false, 200);
                } else {
                    // 向上滑动
                    this.keys['w'] = true;
                    setTimeout(() => this.keys['w'] = false, 200);
                }
            }
        }
    }
    
    // 祝福系统方法
    submitBlessing() {
        const blessingInput = document.getElementById('blessingInput');
        const blessing = blessingInput.value.trim();
        
        if (!blessing) {
            alert('请写下您的祝福内容!');
            return;
        }
        
        // 保存祝福
        this.saveBlessingToStorage(blessing);
        
        // 显示提交成功
        alert('祝福提交成功！谢谢您的美好祝福！🎄');
        
        // 清空输入框
        blessingInput.value = '';
        
        // 隐藏祝福输入区域
        document.querySelector('.blessing-section').style.display = 'none';
    }
    
    saveBlessingToStorage(blessing) {
        const blessings = JSON.parse(localStorage.getItem('christmasGameBlessings') || '[]');
        
        const newBlessing = {
            playerName: this.playerName,
            playerIcon: this.playerIcon,
            blessing: blessing,
            date: new Date().toISOString(),
            score: this.score
        };
        
        blessings.push(newBlessing);
        
        // 只保留最新50条祝福
        if (blessings.length > 50) {
            blessings.splice(0, blessings.length - 50);
        }
        
        localStorage.setItem('christmasGameBlessings', JSON.stringify(blessings));
    }
    
    loadAndDisplayBlessings() {
        const blessings = JSON.parse(localStorage.getItem('christmasGameBlessings') || '[]');
        const blessingsList = document.getElementById('blessingsList');
        
        if (blessings.length === 0) {
            blessingsList.innerHTML = '<p style="text-align: center; color: #ccc; margin: 20px 0;">还没有玩家留下祝福呢～</p>';
            return;
        }
        
        blessingsList.innerHTML = '';
        
        // 按时间倒序显示最新的祝福
        blessings.reverse().forEach(blessing => {
            const blessingItem = document.createElement('div');
            blessingItem.className = 'blessing-item';
            
            const date = new Date(blessing.date);
            const timeStr = date.toLocaleString('zh-CN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            blessingItem.innerHTML = `
                <div class="blessing-header">
                    <span class="player-icon">${blessing.playerIcon}</span>
                    <span class="player-name">${blessing.playerName}</span>
                    <span class="blessing-score">(得分: ${blessing.score})</span>
                    <span class="blessing-time">${timeStr}</span>
                </div>
                <div class="blessing-content">${blessing.blessing}</div>
            `;
            
            blessingsList.appendChild(blessingItem);
        });
    }
    
    createSnowEffect() {
        const snowContainer = document.querySelector('.snow-container');
        
        function createSnowflake() {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = '❄️';
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
            snowflake.style.animationDelay = Math.random() * 2 + 's';
            
            snowContainer.appendChild(snowflake);
            
            setTimeout(() => {
                if (snowflake.parentNode) {
                    snowflake.parentNode.removeChild(snowflake);
                }
            }, 5000);
        }
        
        // 初始雪花
        for (let i = 0; i < 20; i++) {
            setTimeout(createSnowflake, i * 100);
        }
        
        // 持续生成雪花
        setInterval(createSnowflake, 200);
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new ChristmasGame();
});

// 圣诞节祝福信息
console.log('🎄 Merry Christmas! 🎄');
console.log('🎁 圣诞快乐，新年快乐！ 🎁');