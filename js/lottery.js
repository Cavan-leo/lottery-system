class Lottery {
    constructor() {
        this.employees = [
            {"id": "001", "name": "卞氡羑"},
            {"id": "002", "name": "姜晴霞"},
            {"id": "003", "name": "杜啸"},
            {"id": "004", "name": "李明慧"},
            {"id": "005", "name": "谭喆文"},
            {"id": "006", "name": "孙骏"},
            {"id": "007", "name": "童欣"},
            {"id": "008", "name": "张以红"},
            {"id": "009", "name": "杨坤"},
            {"id": "010", "name": "张蕾"},
            {"id": "011", "name": "王蕊"},
            {"id": "012", "name": "伋蓉"},
            {"id": "013", "name": "章晶晶"},
            {"id": "014", "name": "苗蓝方"},
            {"id": "015", "name": "丁雅文"},
            {"id": "016", "name": "袁搏"},
            {"id": "017", "name": "高雨晴"},
            {"id": "018", "name": "张娟"},
            {"id": "019", "name": "姜进林"},
            {"id": "020", "name": "于通"},
            {"id": "021", "name": "刘雨平"},
            {"id": "022", "name": "刘颖"},
            {"id": "023", "name": "李虎"},
            {"id": "024", "name": "黄春草"},
            {"id": "025", "name": "方萌萌"},
            {"id": "026", "name": "刘玲"},
            {"id": "027", "name": "申智强"},
            {"id": "028", "name": "查淑芬"},
            {"id": "029", "name": "李天昊"},
            {"id": "030", "name": "姜涛"},
            {"id": "031", "name": "柳程"},
            {"id": "032", "name": "孙志钢"},
            {"id": "033", "name": "朱珍珍"},
            {"id": "034", "name": "孙敏"},
            {"id": "035", "name": "李庆普"},
            {"id": "036", "name": "陈新波"},
            {"id": "037", "name": "刘旭润"},
            {"id": "038", "name": "高雯雯"},
            {"id": "039", "name": "赵红玲"},
            {"id": "040", "name": "唐震"},
            {"id": "041", "name": "毛艳霞"},
            {"id": "042", "name": "徐海敬"}
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
                    tempAvailable.splice(randomIndex, 1);
                }
            }
            this.nameDisplay.textContent = randomNames.join('、');
        }, 30);
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