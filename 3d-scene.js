createFallbackAmbulance() {
        console.log('🎨 Создаем КРАСИВЫЙ градиентный фон без 3D...');
        
        // УБИРАЕМ ВЕСЬ 3D КОНТЕЙНЕР
        const container = document.getElementById('threejs-container');
        if (container) {
            container.remove();
        }
        
        // Создаем красивый CSS фон
        const backgroundDiv = document.createElement('div');
        backgroundDiv.id = 'beautiful-background';
        backgroundDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: linear-gradient(135deg, 
                #667eea 0%, 
                #764ba2 25%, 
                #f093fb 50%, 
                #f5576c 75%, 
                #4facfe 100%);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
        `;
        
        document.body.appendChild(backgroundDiv);
        
        // Добавляем CSS анимацию
        if (!document.getElementById('background-animation')) {
            const style = document.createElement('style');
            style.id = 'background-animation';
            style.textContent = `
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                #beautiful-background::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
                    opacity: 0.3;
                }
            `;
            document.head.appendChil// ЗАМЕНИТЕ ВЕСЬ 3d-scene.js ЭТИМ ПРОСТЫМ КОДОМ
// Чистый фон только с вашим РАФиком

class SimpleAmbulanceBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.ambulance = null;
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
        
        // Динамическая загрузка FBXLoader если не подключен
        if (typeof THREE.FBXLoader === 'undefined') {
            console.log('🔄 Загружаем FBXLoader динамически...');
            this.loadFBXLoaderScript().then(() => {
                this.loadAmbulanceModel();
            }).catch((error) => {
                console.error('❌ Не удалось загрузить FBXLoader:', error);
                console.log('🔄 Создаем запасную модель...');
                this.createFallbackAmbulance();
            });
        } else {
            console.log('✅ FBXLoader уже подключен');
            this.loadAmbulanceModel();
        }
    }

    loadFBXLoaderScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FBXLoader.js';
            script.onload = () => {
                console.log('✅ FBXLoader загружен динамически');
                resolve();
            };
            script.onerror = () => {
                console.error('❌ Ошибка загрузки FBXLoader');
                reject();
            };
            document.head.appendChild(script);
        });
    }

    loadAmbulanceModel() {
        const loader = new THREE.FBXLoader();
        
        // Попробуем разные пути к файлу
        const possiblePaths = [
            'Models/Ambulance.fbx',
            'models/Ambulance.fbx', 
            'models/ambulance.fbx',
            'Models/ambulance.fbx'
        ];
        
        this.tryLoadModel(loader, possiblePaths, 0);
    }

    tryLoadModel(loader, paths, index) {
        if (index >= paths.length) {
            console.error('❌ НЕ УДАЛОСЬ НАЙТИ РАФИК! Проверьте:');
            console.error('1. Файл Models/Ambulance.fbx существует?');
            console.error('2. Правильно ли назван файл?');
            console.error('3. Доступен ли файл через браузер?');
            
            // НИКАКОГО FALLBACK! Просто пустой фон
            console.log('🚫 Fallback отключен - показываем только чистый фон');
            return;
        }

        const currentPath = paths[index];
        console.log(`🔍 Пробуем загрузить РАФик: ${currentPath}`);
        
        loader.load(currentPath, 
            (fbx) => {
                console.log(`🚑 РАФИК НАЙДЕН И ЗАГРУЖЕН! Путь: ${currentPath}`);
                this.setupAmbulance(fbx);
            },
            (progress) => {
                if (progress.total > 0) {
                    const percent = (progress.loaded / progress.total * 100).toFixed(1);
                    console.log(`⏳ Загрузка РАФика: ${percent}%`);
                }
            },
            (error) => {
                console.warn(`⚠️ РАФик не найден в ${currentPath}: ${error.message}`);
                // Пробуем следующий путь
                this.tryLoadModel(loader, paths, index + 1);
            }
        );
    }

    createFallbackAmbulance() {
        // НИКАКОГО КУБИЧЕСКОГО ГОВНА!
        console.log('🚫 Fallback модель отключена');
        console.log('💡 Проверьте файл Models/Ambulance.fbx');
        
        // Просто чистый фон без 3D объектов
        return;
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

    createFallbackAmbulance() {
        console.log('🔧 Создаем запасную модель РАФика...');
        
        // Простая но красивая запасная модель
        const ambulanceGroup = new THREE.Group();
        
        // Основной корпус
        const bodyGeometry = new THREE.BoxGeometry(4, 1.8, 2);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            shininess: 100 
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        body.castShadow = true;
        ambulanceGroup.add(body);
        
        // Кабина
        const cabinGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.8);
        const cabin = new THREE.Mesh(cabinGeometry, bodyMaterial);
        cabin.position.set(1.8, 1.8, 0);
        cabin.castShadow = true;
        ambulanceGroup.add(cabin);
        
        // Красная полоса
        const stripeGeometry = new THREE.BoxGeometry(4.1, 0.3, 0.02);
        const stripeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        
        const leftStripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        leftStripe.position.set(0, 1.2, 1.02);
        ambulanceGroup.add(leftStripe);
        
        const rightStripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        rightStripe.position.set(0, 1.2, -1.02);
        ambulanceGroup.add(rightStripe);
        
        // Колеса
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        
        const wheelPositions = [
            { x: 1.3, z: 1.2 }, { x: 1.3, z: -1.2 },
            { x: -1.3, z: 1.2 }, { x: -1.3, z: -1.2 }
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos.x, 0.4, pos.z);
            wheel.castShadow = true;
            ambulanceGroup.add(wheel);
        });
        
        this.ambulance = ambulanceGroup;
        this.scene.add(this.ambulance);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Легкое вращение машины
        if (this.ambulance) {
            this.ambulance.rotation.y = Math.sin(time * 0.2) * 0.1;
        }
        
        // Мигание огней
        if (this.emergencyLights) {
            this.emergencyLights.forEach((light, index) => {
                if (light.material) {
                    const intensity = Math.sin(time * 8 + index * Math.PI) > 0 ? 0.8 : 0.1;
                    light.material.emissive.setScalar(intensity * 0.5);
                }
            });
        }
        
        // Легкое движение камеры
        this.camera.position.x = 8 + Math.sin(time * 0.3) * 0.5;
        this.camera.position.y = 3 + Math.sin(time * 0.4) * 0.2;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Автоматический запуск
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚑 Инициализация фона с РАФиком...');
    
    setTimeout(() => {
        if (typeof THREE !== 'undefined') {
            window.ambulanceBackground = new SimpleAmbulanceBackground();
            console.log('✅ Фон с РАФиком создан!');
        } else {
            console.error('❌ Three.js не загружен');
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
