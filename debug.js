// debug.js - Скрипт для отладки проблем с геймификацией
(function() {
    'use strict';
    
    // Добавляем панель отладки только на localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(createDebugPanel, 3000);
        });
    }
    
    function createDebugPanel() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        debugPanel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">🐛 Debug Panel</div>
            <div id="debug-content"></div>
            <div style="margin-top: 10px;">
                <button onclick="window.testGamification()" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Test Game</button>
                <button onclick="window.resetGameStats()" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Reset Stats</button>
                <button onclick="window.debugInfo()" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Show Info</button>
                <button onclick="document.getElementById('debug-panel').remove()" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Close</button>
            </div>
        `;
        
        document.body.appendChild(debugPanel);
        
        // Обновляем информацию каждые 2 секунды
        setInterval(updateDebugInfo, 2000);
        updateDebugInfo();
    }
    
    function updateDebugInfo() {
        const content = document.getElementById('debug-content');
        if (!content) return;
        
        let info = '';
        
        // Проверяем геймификацию
        if (window.Gamification) {
            info += `✅ Gamification: Loaded<br>`;
            info += `📊 Total Tests: ${window.Gamification.stats.totalQuizzes}<br>`;
            info += `🔥 Current Streak: ${window.Gamification.stats.currentStreak}<br>`;
            info += `⭐ Best Streak: ${window.Gamification.stats.bestStreak}<br>`;
            info += `🏆 Achievements: ${window.Gamification.stats.achievements.length}<br>`;
            info += `🔧 Initialized: ${window.Gamification.initialized}<br>`;
        } else {
            info += `❌ Gamification: Not loaded<br>`;
        }
        
        // Проверяем localStorage
        try {
            const saved = localStorage.getItem('medicalQuizGameStats');
            if (saved) {
                info += `💾 LocalStorage: OK<br>`;
                const data = JSON.parse(saved);
                info += `📄 Saved Tests: ${data.totalQuizzes || 0}<br>`;
            } else {
                info += `💾 LocalStorage: Empty<br>`;
            }
        } catch (e) {
            info += `❌ LocalStorage: Error - ${e.message}<br>`;
        }
        
        // Проверяем VK Bridge
        if (window.vkBridge || window.vkBridgeInstance) {
            info += `✅ VK Bridge: Available<br>`;
        } else {
            info += `❌ VK Bridge: Not found<br>`;
        }
        
        // Проверяем DOM элементы
        const statsEl = document.getElementById('gamification-stats');
        if (statsEl) {
            info += `✅ Stats Display: Visible<br>`;
        } else {
            info += `❌ Stats Display: Missing<br>`;
        }
        
        const shareBtn = document.getElementById('share-results');
        if (shareBtn) {
            info += `✅ Share Button: Found<br>`;
        } else {
            info += `❌ Share Button: Missing<br>`;
        }
        
        document.getElementById('debug-content').innerHTML = info;
    }
    
    // Глобальная функция для показа полной информации
    window.debugInfo = function() {
        console.group('🐛 Debug Information');
        
        console.log('📊 Gamification Stats:', window.Gamification ? window.Gamification.stats : 'Not loaded');
        
        try {
            const saved = localStorage.getItem('medicalQuizGameStats');
            console.log('💾 LocalStorage Data:', saved ? JSON.parse(saved) : 'Empty');
        } catch (e) {
            console.error('❌ LocalStorage Error:', e);
        }
        
        console.log('🌐 VK Bridge:', {
            vkBridge: !!window.vkBridge,
            vkBridgeInstance: !!window.vkBridgeInstance,
            vkBridgeGlobal: typeof vkBridge !== 'undefined'
        });
        
        console.log('🎮 Integration Status:', {
            gamificationLoaded: !!window.Gamification,
            gamificationInitialized: window.Gamification ? window.Gamification.initialized : false,
            testFunctionAvailable: typeof window.testGamification === 'function',
            resetFunctionAvailable: typeof window.resetGameStats === 'function'
        });
        
        console.groupEnd();
        
        // Также показываем в alert для удобства
        alert('Debug информация выведена в консоль браузера (F12)');
    };
    
    // Функция для форсированного сохранения
    window.forceSave = function() {
        if (window.Gamification) {
            window.Gamification.saveStats();
            console.log('💾 Принудительное сохранение выполнено');
            updateDebugInfo();
        }
    };
    
    // Функция для форсированной загрузки
    window.forceLoad = function() {
        if (window.Gamification) {
            window.Gamification.loadStats();
            window.Gamification.updateStatsDisplay();
            console.log('📥 Принудительная загрузка выполнена');
            updateDebugInfo();
        }
    };
    
    // Перехватываем ошибки
    window.addEventListener('error', function(e) {
        console.error('🚨 JavaScript Error:', e.error);
    });
    
    // Перехватываем unhandled promises
    window.addEventListener('unhandledrejection', function(e) {
        console.error('🚨 Unhandled Promise Rejection:', e.reason);
    });
    
})();
