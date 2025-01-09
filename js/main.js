document.addEventListener('DOMContentLoaded', () => {
    const lottery = new Lottery();
    
    // 获取按钮元素
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    // 绑定开始抽奖事件
    startBtn.addEventListener('click', () => {
        lottery.startLottery();
        startBtn.disabled = true;
        stopBtn.disabled = false;
    });
    
    // 绑定停止抽奖事件
    stopBtn.addEventListener('click', () => {
        lottery.stopLottery();
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });
    
    // 绑定清空记录事件
    clearBtn.addEventListener('click', () => {
        lottery.clearAll();
    });
}); 