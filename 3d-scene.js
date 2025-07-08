// ИСПРАВЛЕННЫЙ 3d-scene.js - загружаем ОРИГИНАЛЬНЫЙ .3ds файл

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
        console.log('🚑 Создаем фон с ОРИГИНАЛЬНЫМ .3ds РАФиком...');
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
        // Яркий солнечный свет
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(10, 10, 5);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);

        // Яркий окружающий свет
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        // Дополнительная подсветка спереди
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.6);
        frontLight.position.set(0, 5, 10);
        this.scene.add(frontLight);

        // Легкая подсветка снизу
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-5, -5, 5);
        this.scene.add(fillLight);
        
        console.log('💡 Установлено яркое освещение для лучшей видимости');
    }

    loadAmbulance() {
        console.log('📦 Загружаем ОРИГИНАЛЬНЫЙ .3ds РАФик со всеми текстурами...');
        
        // ВАЖНО: Устанавливаем путь к текстурам ПЕРЕД загрузкой
        const loadingManager = new THREE.LoadingManager();
        
        // Обработчик для всех типов файлов
        loadingManager.setURLModifier((url) => {
            console.log('🔍 Запрос файла:', url);
            
            // Если это текстура или дополнительный файл
            if (url.match(/\.(jpg|jpeg|png|bmp|tga|dds|exr|hdr|mtl|mat)$/i)) {
                console.log('📁 Перенаправляем текстуру в Models/:', url);
                // Получаем только имя файла
                const filename = url.split('/').pop().split('\\').pop();
                return './Models/' + filename;
            }
            return url;
        });
        
        // Событие при успешной загрузке всех ресурсов
        loadingManager.onLoad = () => {
            console.log('✅ Все ресурсы загружены!');
        };
        
        loadingManager.onProgress = (url, loaded, total) => {
            console.log(`⏳ Загружено ${loaded}/${total}: ${url}`);
        };
        
        loadingManager.onError = (url) => {
            console.error('❌ Ошибка загрузки:', url);
        };
        
        // Загружаем 3DSLoader
        this.load3DSLoader()
            .then(() => {
                console.log('✅ 3DSLoader загружен, пробуем ОРИГИНАЛЬНУЮ модель...');
                return this.loadAmbulanceModel(loadingManager);
            })
            .catch((error) => {
                console.error('❌ Критическая ошибка загрузки:', error);
                console.log('🚫 FALLBACK ОТКЛЮЧЕН - показываем только чистый фон');
            });
    }

    load3DSLoader() {
        return new Promise((resolve, reject) => {
            // Проверяем, загружен ли уже 3DSLoader
            if (typeof THREE.TDSLoader !== 'undefined') {
                console.log('✅ 3DSLoader уже доступен');
                resolve();
                return;
            }

            console.log('🔄 Загружаем 3DSLoader для .3ds файлов...');
            
            // Загружаем скрипт 3DSLoader
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/TDSLoader.js';
            
            script.onload = () => {
                console.log('✅ 3DSLoader скрипт загружен');
                
                // Ждем, пока 3DSLoader станет доступен
                let attempts = 0;
                const checkLoader = () => {
                    attempts++;
                    if (typeof THREE.TDSLoader !== 'undefined') {
                        console.log('✅ 3DSLoader готов к использованию');
                        resolve();
                    } else if (attempts < 20) {
                        setTimeout(checkLoader, 100);
                    } else {
                        console.error('❌ 3DSLoader не стал доступен за 2 секунды');
                        reject(new Error('3DSLoader не загрузился'));
                    }
                };
                
                setTimeout(checkLoader, 100);
            };
            
            script.onerror = () => {
                console.error('❌ Ошибка загрузки 3DSLoader скрипта');
                reject(new Error('Не удалось загрузить 3DSLoader'));
            };
            
            document.head.appendChild(script);
        });
    }

    loadAmbulanceModel(loadingManager) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TDSLoader(loadingManager);
            
            // Пути к ОРИГИНАЛЬНОМУ .3ds файлу
            const possiblePaths = [
                './Models/raf22031.3ds',        // Точное имя файла
                './models/raf22031.3ds',        // Строчными буквами
                'Models/raf22031.3ds',          // Без точки в начале
                'models/raf22031.3ds'           // Строчными без точки
            ];
            
            this.tryLoadModel(loader, possiblePaths, 0, resolve, reject);
        });
    }

    tryLoadModel(loader, paths, index, resolve, reject) {
        if (index >= paths.length) {
            console.error('❌ ОРИГИНАЛЬНАЯ МОДЕЛЬ РАФИКА НЕ НАЙДЕНА! Проверьте:');
            console.error('1. Файл raf22031.3ds существует в папке Models/');
            console.error('2. Правильно ли назван файл');
            console.error('3. Доступен ли файл через веб-сервер');
            
            console.log('🚫 Fallback модель ОТКЛЮЧЕНА - показываем только чистый фон');
            reject(new Error('Оригинальная модель не найдена'));
            return;
        }

        const currentPath = paths[index];
        console.log(`🔍 Попытка ${index + 1}/${paths.length}: ${currentPath}`);
        
        loader.load(
            currentPath,
            
            // Успешная загрузка
            (object) => {
                console.log(`🚑 ОРИГИНАЛЬНЫЙ РАФИК НАЙДЕН И ЗАГРУЖЕН! Путь: ${currentPath}`);
                console.log('📊 Структура модели:', object);
                this.setupAmbulance(object);
                resolve(object);
            },
            
            // Прогресс загрузки
            (progress) => {
                if (progress.total > 0) {
                    const percent = (progress.loaded / progress.total * 100).toFixed(1);
                    console.log(`⏳ Загрузка оригинального РАФика: ${percent}%`);
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

    setupAmbulance(object) {
        this.ambulance = object;
        
        console.log('🎨 Настраиваем ОРИГИНАЛЬНЫЙ РАФик с родными текстурами...');
        
        // Автоматическое масштабирование
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxSize;
        
        this.ambulance.scale.setScalar(scale);
        
        // Центрирование модели
        const center = box.getCenter(new THREE.Vector3());
        this.ambulance.position.sub(center.multiplyScalar(scale));
        this.ambulance.position.y = 0;
        
        // Обрабатываем материалы - СОХРАНЯЕМ ВСЕ ОРИГИНАЛЬНОЕ!
        this.ambulance.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                console.log(`🔍 Обрабатываем меш: "${child.name || 'без имени'}"`);
                console.log(`📐 Материал:`, child.material);
                
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((material, index) => {
                            console.log(`📐 Материал ${index}:`, material);
                            this.enhanceOriginalMaterial(material, child.name);
                        });
                    } else {
                        this.enhanceOriginalMaterial(child.material, child.name);
                    }
                } else {
                    // Создаем базовый материал только если его вообще нет
                    console.log(`⚠️ Нет материала для "${child.name || 'меш'}", создаем базовый`);
                    child.material = new THREE.MeshPhongMaterial({
                        color: 0xcccccc,
                        shininess: 30,
                        side: THREE.DoubleSide
                    });
                }
            }
        });
        
        // Добавляем в сцену
        this.scene.add(this.ambulance);
        
        // Добавляем мигающие огни
        this.addSimpleLights();
        
        console.log('🎉 ОРИГИНАЛЬНЫЙ РАФик готов с родными материалами!');
    }
    
    // Функция МИНИМАЛЬНОГО улучшения оригинальных материалов
    enhanceOriginalMaterial(material, meshName) {
        if (!material) return;
        
        console.log(`🔧 Улучшаем материал для "${meshName || 'меш'}":`, material);
        
        // Базовые улучшения рендеринга
        material.side = THREE.DoubleSide;
        material.shadowSide = THREE.DoubleSide;
        material.needsUpdate = true;
        
        // Проверяем текстуры
        if (material.map) {
            console.log('🖼️ Основная текстура найдена:', material.map);
            material.map.needsUpdate = true;
            material.map.flipY = false; // Для .3ds файлов часто нужно
            
            // Улучшаем качество текстур
            material.map.minFilter = THREE.LinearMipMapLinearFilter;
            material.map.magFilter = THREE.LinearFilter;
            material.map.generateMipmaps = true;
        } else {
            console.log('📝 Нет основной текстуры, используем цвет материала');
        }
        
        // Карта нормалей
        if (material.normalMap) {
            console.log('🗺️ Карта нормалей найдена');
            material.normalMap.needsUpdate = true;
            material.normalMap.flipY = false;
        }
        
        // Карта отражений  
        if (material.envMap) {
            console.log('✨ Карта отражений найдена');
        }
        
        // Настраиваем освещение
        if (material.shininess !== undefined) {
            material.shininess = Math.max(material.shininess, 10);
        }
        
        // ТОЛЬКО если материал СОВСЕМ черный и нет текстуры - слегка осветляем
        if (!material.map && material.color) {
            const brightness = material.color.r + material.color.g + material.color.b;
            if (brightness < 0.1) {
                console.log('💡 Слегка осветляем черный материал без текстуры');
                material.color.setRGB(0.3, 0.3, 0.3); // Темно-серый вместо черного
            }
        }
        
        console.log(`✅ Материал готов: цвет=${material.color?.getHexString() || 'нет'}, текстура=${!!material.map}`);
    }

    addSimpleLights() {
        if (!this.ambulance) return;
        
        // Яркие мигающие огни
        const lightGeometry = new THREE.SphereGeometry(0.08, 12, 12);
        
        // Синие мигалки
        const blueMaterial = new THREE.MeshPhongMaterial({
            color: 0x0066ff,
            emissive: 0x003388,
            shininess: 100
        });
        
        // Красные мигалки  
        const redMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            emissive: 0x880000,
            shininess: 100
        });
        
        // Позиции огней (адаптируем под модель)
        const box = new THREE.Box3().setFromObject(this.ambulance);
        const size = box.getSize(new THREE.Vector3());
        
        this.emergencyLights = [];
        
        // Огни на крыше
        for (let i = 0; i < 6; i++) {
            const isBlue = i % 2 === 0;
            const material = isBlue ? blueMaterial.clone() : redMaterial.clone();
            const light = new THREE.Mesh(lightGeometry, material);
            
            // Расположение огней по кругу на крыше
            const angle = (i / 6) * Math.PI * 2;
            light.position.set(
                Math.cos(angle) * size.x * 0.2,
                size.y * 0.8,
                Math.sin(angle) * size.z * 0.2
            );
            
            this.ambulance.add(light);
            this.emergencyLights.push(light);
        }
        
        console.log('🚨 Добавлены яркие мигающие огни на оригинальный РАФик');
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
    console.log('🚑 Инициализация фона с ОРИГИНАЛЬНЫМ .3ds РАФиком...');
    
    // Проверяем доступность Three.js
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js не загружен! Проверьте подключение скрипта.');
        return;
    }
    
    console.log('✅ Three.js доступен, версия:', THREE.REVISION);
    
    setTimeout(() => {
        try {
            window.ambulanceBackground = new SimpleAmbulanceBackground();
            console.log('✅ Фон с ОРИГИНАЛЬНЫМ РАФиком создан!');
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
    
    check3DSLoader: () => {
        console.log('3DSLoader доступен:', typeof THREE !== 'undefined' && typeof THREE.TDSLoader !== 'undefined');
    },
    
    checkModel: () => {
        if (window.ambulanceBackground && window.ambulanceBackground.ambulance) {
            console.log('✅ ОРИГИНАЛЬНАЯ модель РАФика загружена');
            console.log('Позиция:', window.ambulanceBackground.ambulance.position);
            console.log('Масштаб:', window.ambulanceBackground.ambulance.scale);
            console.log('Структура:', window.ambulanceBackground.ambulance);
        } else {
            console.log('❌ Модель РАФика НЕ загружена');
        }
    },
    
    testPaths: () => {
        const paths = [
            './Models/raf22031.3ds',
            './models/raf22031.3ds', 
            'Models/raf22031.3ds',
            'models/raf22031.3ds'
        ];
        
        console.log('🔍 Тестируем пути к ОРИГИНАЛЬНОЙ модели:');
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
        console.log('=== ДИАГНОСТИКА ОРИГИНАЛЬНОГО 3D ФОНА ===');
        window.debugAmbulance.checkThreeJS();
        window.debugAmbulance.check3DSLoader();
        window.debugAmbulance.checkModel();
        console.log('Для проверки путей: window.debugAmbulance.testPaths()');
    }
};

console.log('✅ 3D фон с ОРИГИНАЛЬНЫМ .3ds файлом загружен');
console.log('🐛 Диагностика: window.debugAmbulance.info()');
console.log('🔍 Проверка путей: window.debugAmbulance.testPaths()');
