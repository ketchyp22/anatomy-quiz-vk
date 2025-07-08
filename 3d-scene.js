// ИСПРАВЛЕННЫЙ 3d-scene.js - без синтаксических ошибок

class SimpleAmbulanceBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.ambulance = null;
        this.emergencyLights = [];
        this.init();
    }

    init() {
        console.log('🚑 Создаем простой фон с РАФиком...');
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLighting();
        this.loadAmbulance();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
        
        // Простой градиентный фон
        this.scene.background = new THREE.Color(0x87CEEB); // Небесно-голубой
        
        // Легкий туман для глубины
        this.scene.fog = new THREE.Fog(0x87CEEB, 10, 50);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            100
        );
        
        // Камера смотрит на машину под углом
        this.camera.position.set(8, 3, 8);
        this.camera.lookAt(0, 0, 0);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Создаем контейнер для фона
        const container = document.createElement('div');
        container.id = 'threejs-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
        
        container.appendChild(this.renderer.domElement);
        document.body.appendChild(container);
    }

    createLighting() {
        // Мягкий солнечный свет
        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(10, 10, 5);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);

        // Мягкий окружающий свет
        const ambientLight = new THREE.AmbientLight(0x404080, 0.6);
        this.scene.add(ambientLight);

        // Легкая подсветка снизу
        const fillLight = new THREE.DirectionalLight(0x8080ff, 0.3);
        fillLight.position.set(-5, -5, 5);
        this.scene.add(fillLight);
    }

    loadAmbulance() {
        console.log('📦 Загружаем вашу модель РАФика...');
        
        // Загружаем FBXLoader ПРАВИЛЬНО
        this.loadFBXLoader()
            .then(() => {
                console.log('✅ FBXLoader загружен, пробуем модель...');
                return this.loadAmbulanceModel();
            })
            .catch((error) => {
                console.error('❌ Критическая ошибка загрузки:', error);
                console.log('🚫 FALLBACK ОТКЛЮЧЕН - показываем только чистый фон');
                // НЕ создаем fallback модель!
            });
    }

    loadFBXLoader() {
        return new Promise((resolve, reject) => {
            // Проверяем, загружен ли уже FBXLoader
            if (typeof THREE.FBXLoader !== 'undefined') {
                console.log('✅ FBXLoader уже доступен');
                resolve();
                return;
            }

            console.log('🔄 Загружаем FBXLoader...');
            
            // Загружаем скрипт FBXLoader
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FBXLoader.js';
            
            script.onload = () => {
                console.log('✅ FBXLoader скрипт загружен');
                
                // Ждем, пока FBXLoader станет доступен
                let attempts = 0;
                const checkLoader = () => {
                    attempts++;
                    if (typeof THREE.FBXLoader !== 'undefined') {
                        console.log('✅ FBXLoader готов к использованию');
                        resolve();
                    } else if (attempts < 20) {
                        setTimeout(checkLoader, 100);
                    } else {
                        console.error('❌ FBXLoader не стал доступен за 2 секунды');
                        reject(new Error('FBXLoader не загрузился'));
                    }
                };
                
                setTimeout(checkLoader, 100);
            };
            
            script.onerror = () => {
                console.error('❌ Ошибка загрузки FBXLoader скрипта');
                reject(new Error('Не удалось загрузить FBXLoader'));
            };
            
            document.head.appendChild(script);
        });
    }

    loadAmbulanceModel() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FBXLoader();
            
            // ИСПРАВЛЕННЫЕ пути к файлу
            const possiblePaths = [
                './Models/Ambulance.fbx',      // Относительный путь от корня
                './models/Ambulance.fbx',      // Строчными буквами
                'Models/Ambulance.fbx',        // Без точки в начале
                'models/Ambulance.fbx',        // Строчными без точки
                './assets/Models/Ambulance.fbx', // В папке assets
                './assets/models/ambulance.fbx'  // Все строчными в assets
            ];
            
            this.tryLoadModel(loader, possiblePaths, 0, resolve, reject);
        });
    }

    tryLoadModel(loader, paths, index, resolve, reject) {
        if (index >= paths.length) {
            console.error('❌ МОДЕЛЬ РАФИКА НЕ НАЙДЕНА! Проверьте:');
            console.error('1. Файл существует в папке Models/ или models/');
            console.error('2. Правильно ли назван файл (Ambulance.fbx)');
            console.error('3. Доступен ли файл через веб-сервер');
            console.error('4. Нет ли проблем с CORS');
            
            // ВАЖНО: НЕ создаем fallback!
            console.log('🚫 Fallback модель ОТКЛЮЧЕНА - показываем только чистый фон');
            reject(new Error('Модель не найдена'));
            return;
        }

        const currentPath = paths[index];
        console.log(`🔍 Попытка ${index + 1}/${paths.length}: ${currentPath}`);
        
        loader.load(
            currentPath,
            
            // Успешная загрузка
            (fbx) => {
                console.log(`🚑 РАФИК НАЙДЕН И ЗАГРУЖЕН! Путь: ${currentPath}`);
                this.setupAmbulance(fbx);
                resolve(fbx);
            },
            
            // Прогресс загрузки
            (progress) => {
                if (progress.total > 0) {
                    const percent = (progress.loaded / progress.total * 100).toFixed(1);
                    console.log(`⏳ Загрузка РАФика: ${percent}%`);
                }
            },
            
            // Ошибка загрузки
            (error) => {
                console.warn(`⚠️ Путь ${currentPath} не работает:`, error.message);
                // Пробуем следующий путь
                this.tryLoadModel(loader, paths, index + 1, resolve, reject);
            }
        );
    }

    setupAmbulance(fbx) {
        this.ambulance = fbx;
        
        // Автоматическое масштабирование
        const box = new THREE.Box3().setFromObject(fbx);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxSize; // Нормализуем до размера ~3 единицы
        
        this.ambulance.scale.setScalar(scale);
        
        // Центрирование модели
        const center = box.getCenter(new THREE.Vector3());
        this.ambulance.position.sub(center.multiplyScalar(scale));
        
        // Поднимаем над "землей"
        this.ambulance.position.y = 0;
        
        // Настройка материалов и теней
        this.ambulance.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Улучшаем материалы
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => {
                            material.side = THREE.DoubleSide;
                            material.shadowSide = THREE.DoubleSide;
                        });
                    } else {
                        child.material.side = THREE.DoubleSide;
                        child.material.shadowSide = THREE.DoubleSide;
                    }
                }
            }
        });
        
        // Добавляем в сцену
        this.scene.add(this.ambulance);
        
        // Добавляем простые мигающие огни
        this.addSimpleLights();
        
        console.log('🎉 РАФик готов к работе!');
    }

    addSimpleLights() {
        if (!this.ambulance) return;
        
        // Простые мигающие огни
        const lightGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const blueMaterial = new THREE.MeshPhongMaterial({
            color: 0x0066ff,
            emissive: 0x003388
        });
        
        // Позиции огней (адаптируем под модель)
        const box = new THREE.Box3().setFromObject(this.ambulance);
        const size = box.getSize(new THREE.Vector3());
        
        this.emergencyLights = [];
        
        // Огни на крыше
        for (let i = 0; i < 4; i++) {
            const light = new THREE.Mesh(lightGeometry, blueMaterial.clone());
            light.position.set(
                (i % 2 - 0.5) * size.x * 0.3,
                size.y * 0.9,
                (Math.floor(i / 2) - 0.5) * size.z * 0.3
            );
            this.ambulance.add(light);
            this.emergencyLights.push(light);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Легкое вращение машины (только если она загружена)
        if (this.ambulance) {
            this.ambulance.rotation.y = Math.sin(time * 0.2) * 0.1;
            
            // Мигание огней (только если они есть)
            if (this.emergencyLights && this.emergencyLights.length > 0) {
                this.emergencyLights.forEach((light, index) => {
                    if (light.material) {
                        const intensity = Math.sin(time * 8 + index * Math.PI) > 0 ? 0.8 : 0.1;
                        light.material.emissive.setScalar(intensity * 0.5);
                    }
                });
            }
        }
        
        // Легкое движение камеры
        this.camera.position.x = 8 + Math.sin(time * 0.3) * 0.5;
        this.camera.position.y = 3 + Math.sin(time * 0.4) * 0.2;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Автоматический запуск с диагностикой
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚑 Инициализация фона с РАФиком...');
    
    // Проверяем доступность Three.js
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js не загружен! Проверьте подключение скрипта.');
        return;
    }
    
    console.log('✅ Three.js доступен, версия:', THREE.REVISION);
    
    setTimeout(() => {
        try {
            window.ambulanceBackground = new SimpleAmbulanceBackground();
            console.log('✅ Фон с РАФиком создан!');
        } catch (error) {
            console.error('❌ Ошибка создания фона:', error);
        }
    }, 500);
});

// Адаптация под изменение размера окна
window.addEventListener('resize', function() {
    if (window.ambulanceBackground) {
        const bg = window.ambulanceBackground;
        bg.camera.aspect = window.innerWidth / window.innerHeight;
        bg.camera.updateProjectionMatrix();
        bg.renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Функции для отладки
window.debugAmbulance = {
    checkThreeJS: () => {
        console.log('Three.js доступен:', typeof THREE !== 'undefined');
        if (typeof THREE !== 'undefined') {
            console.log('Версия Three.js:', THREE.REVISION);
        }
    },
    
    checkFBXLoader: () => {
        console.log('FBXLoader доступен:', typeof THREE !== 'undefined' && typeof THREE.FBXLoader !== 'undefined');
    },
    
    checkModel: () => {
        if (window.ambulanceBackground && window.ambulanceBackground.ambulance) {
            console.log('✅ Модель РАФика загружена');
            console.log('Позиция:', window.ambulanceBackground.ambulance.position);
            console.log('Масштаб:', window.ambulanceBackground.ambulance.scale);
        } else {
            console.log('❌ Модель РАФика НЕ загружена');
        }
    },
    
    testPaths: () => {
        const paths = [
            './Models/Ambulance.fbx',
            './models/Ambulance.fbx',
            'Models/Ambulance.fbx',
            'models/Ambulance.fbx'
        ];
        
        console.log('🔍 Тестируем пути к модели:');
        paths.forEach(path => {
            fetch(path, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        console.log(`✅ ${path} - ДОСТУПЕН`);
                    } else {
                        console.log(`❌ ${path} - НЕ ДОСТУПЕН (${response.status})`);
                    }
                })
                .catch(() => {
                    console.log(`❌ ${path} - ОШИБКА ДОСТУПА`);
                });
        });
    },
    
    info: () => {
        console.log('=== ДИАГНОСТИКА 3D ФОНА ===');
        window.debugAmbulance.checkThreeJS();
        window.debugAmbulance.checkFBXLoader();
        window.debugAmbulance.checkModel();
        console.log('Для проверки путей: window.debugAmbulance.testPaths()');
    }
};

console.log('✅ Исправленный 3D фон загружен БЕЗ синтаксических ошибок');
console.log('🐛 Диагностика: window.debugAmbulance.info()');
console.log('🔍 Проверка путей: window.debugAmbulance.testPaths()');
