class Lottery {
    constructor() {
        this.employees = [
            {"id": "001", "name": "张三"},
            {"id": "002", "name": "李四"},
            {"id": "003", "name": "王五"},
            {"id": "004", "name": "赵六"},
            {"id": "005", "name": "钱七"},
            {"id": "006", "name": "孙八"},
            {"id": "007", "name": "周九"},
            {"id": "008", "name": "吴十"}
        ];
        const savedWinners = JSON.parse(localStorage.getItem('winners') || '[]');
        this.winners = new Set(savedWinners);
        this.isRunning = false;
        this.timer = null;
        
        this.drawCount = document.getElementById('drawCount');
        this.nameDisplay = document.getElementById('nameDisplay');
        
        this.loadHistory();
    }

    loadHistory() {
        const history = JSON.parse(localStorage.getItem('winnerHistory') || '[]');
        const winnersList = document.getElementById('winnersList');
        winnersList.innerHTML = '';
        history.forEach(record => {
            if (record.time && record.names) {
                const winnerDiv = document.createElement('div');
                winnerDiv.textContent = `${record.time} - ${record.prize || '全部'} - ${record.names}`;
                winnersList.appendChild(winnerDiv);
            }
        });
    }

    saveWinnerRecord(winners) {
        const winnerIds = Array.from(this.winners);
        localStorage.setItem('winners', JSON.stringify(winnerIds));
        
        const now = new Date();
        const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const prizeSelect = document.getElementById('prizeSelect');
        const prizeName = prizeSelect.options[prizeSelect.selectedIndex].text;
        
        const record = {
            time: timeStr,
            prize: prizeName,
            names: winners.map(w => w.name).join('、')
        };
        
        const history = JSON.parse(localStorage.getItem('winnerHistory') || '[]');
        history.unshift(record);
        localStorage.setItem('winnerHistory', JSON.stringify(history));
    }

    startLottery() {
        const count = parseInt(this.drawCount.value);
        if (count < 1) {
            this.showAlert('抽奖人数必须大于0');
            return;
        }

        const availablePeople = this.getAvailablePeople();
        if (availablePeople.length < count) {
            this.showAlert(`当前只剩${availablePeople.length}人可供抽奖`);
            return;
        }

        this.isRunning = true;
        this.timer = setInterval(() => {
            const randomNames = [];
            const tempAvailable = [...availablePeople];
            
            for (let i = 0; i < count; i++) {
                if (tempAvailable.length > 0) {
                    const randomIndex = Math.floor(Math.random() * tempAvailable.length);
                    randomNames.push(tempAvailable[randomIndex].name);
                    tempAvailable.splice(randomIndex, 1); // 防止重复显示同一个名字
                }
            }
            this.nameDisplay.textContent = randomNames.join('、');
        }, 50);
    }

    stopLottery() {
        if (!this.isRunning) return;
        
        clearInterval(this.timer);
        this.isRunning = false;
        
        const count = parseInt(this.drawCount.value);
        const availablePeople = this.getAvailablePeople();
        const newWinners = [];
        
        for (let i = 0; i < count && availablePeople.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availablePeople.length);
            const winner = availablePeople.splice(randomIndex, 1)[0];
            newWinners.push(winner);
            this.winners.add(winner.id);
        }

        this.nameDisplay.textContent = newWinners.map(w => w.name).join('、');
        this.updateWinnersList(newWinners);
        this.saveWinnerRecord(newWinners);
    }

    getAvailablePeople() {
        return this.employees.filter(emp => !this.winners.has(emp.id));
    }

    updateWinnersList(winners) {
        const winnersList = document.getElementById('winnersList');
        const winnerDiv = document.createElement('div');
        const now = new Date();
        const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const prizeSelect = document.getElementById('prizeSelect');
        const prizeName = prizeSelect.options[prizeSelect.selectedIndex].text;
        
        winnerDiv.textContent = `${timeStr} - ${prizeName} - ${winners.map(w => w.name).join('、')}`;
        winnersList.insertBefore(winnerDiv, winnersList.firstChild);
    }

    clearAll() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        // 创建确认框
        const confirmDiv = document.createElement('div');
        confirmDiv.className = 'confirm-modal';
        
        // 添加确认框内容
        confirmDiv.innerHTML = `
            <h3>确认清空</h3>
            <p>确定要清空所有中奖记录吗？</p>
            <div class="modal-buttons">
                <button class="cancel-btn">取消</button>
                <button class="confirm-btn">确定</button>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(confirmDiv);
        
        // 绑定事件
        const closeModal = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(confirmDiv);
        };
        
        const handleConfirm = () => {
            this.winners.clear();
            localStorage.removeItem('winners');
            localStorage.removeItem('winnerHistory');
            document.getElementById('winnersList').innerHTML = '';
            document.getElementById('nameDisplay').textContent = '准备开始';
            closeModal();
        };
        
        confirmDiv.querySelector('.cancel-btn').onclick = closeModal;
        confirmDiv.querySelector('.confirm-btn').onclick = handleConfirm;
        overlay.onclick = closeModal;
    }

    showAlert(message) {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        // 创建提示框
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-modal';
        
        // 添加提示内容
        alertDiv.innerHTML = `
            <p>${message}</p>
            <button>确定</button>
        `;
        
        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(alertDiv);
        
        // 绑定关闭事件
        const closeAlert = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(alertDiv);
        };
        
        alertDiv.querySelector('button').onclick = closeAlert;
        overlay.onclick = closeAlert;
    }
} 