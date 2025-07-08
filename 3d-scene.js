// ПОЛНОСТЬЮ ИСПРАВЛЕННЫЙ 3d-scene.js с правильными текстурами РАФика
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
        console.log('🚑 Загружаем РАФик с правильными текстурами...');
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLighting();
        this.loadAmbulance();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 10, 50);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(8, 3, 8);
        this.camera.lookAt(0, 0, 0);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
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
        // Яркое солнечное освещение
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
        sunLight.position.set(10, 10, 5);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);

        // Яркий окружающий свет
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);

        // Дополнительная подсветка спереди
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
        frontLight.position.set(0, 5, 10);
        this.scene.add(frontLight);

        // Подсветка сзади
        const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
        backLight.position.set(0, 5, -10);
        this.scene.add(backLight);

        // Боковая подсветка
        const sideLight = new THREE.DirectionalLight(0xffffff, 0.4);
        sideLight.position.set(-10, 3, 0);
        this.scene.add(sideLight);
        
        console.log('💡 Установлено многоточечное освещение для РАФика');
    }

    loadAmbulance() {
        console.log('📦 Загружаем РАФик из файлов: raf22031.3ds + текстуры...');
        
        // Создаем загрузчик с правильной настройкой для ВАШИХ текстур
        const loadingManager = new THREE.LoadingManager();
        
        // Настройка для работы с ВАШИМИ конкретными файлами
        loadingManager.setURLModifier((url) => {
            console.log('🔍 TDSLoader запрашивает:', url);
            
            // Если запрашивается текстура
            if (url.includes('raf22031') && (url.includes('.jpg') || url.includes('.JPG'))) {
                const texturePath = './Models/raf22031.JPG';
                console.log('🖼️ Перенаправляем на JPG текстуру:', texturePath);
                return texturePath;
            }
            
            if (url.includes('raf22031') && (url.includes('.bmp') || url.includes('.BMP'))) {
                const texturePath = './Models/raf22031.bmp';
                console.log('🖼️ Перенаправляем на BMP текстуру:', texturePath);
                return texturePath;
            }
            
            // Общий случай - ищем в папке Models
            if (url.match(/\.(jpg|jpeg|png|bmp|tga|dds)$/i)) {
                const filename = url.split('/').pop().split('\\').pop();
                const texturePath = './Models/' + filename;
                console.log('🖼️ Общее перенаправление текстуры:', texturePath);
                return texturePath;
            }
            
            return url;
        });
        
        loadingManager.onLoad = () => {
            console.log('✅ ВСЕ файлы РАФика загружены!');
        };
        
        loadingManager.onProgress = (url, loaded, total) => {
            console.log(`⏳ Загружено ${loaded}/${total}: ${url}`);
        };
        
        loadingManager.onError = (url) => {
            console.error('❌ Ошибка загрузки файла РАФика:', url);
        };
        
        this.loadTDSLoader()
            .then(() => {
                this.loadRaf3DS(loadingManager);
            })
            .catch((error) => {
                console.error('❌ Не удалось загрузить TDSLoader:', error);
            });
    }

    loadTDSLoader() {
        return new Promise((resolve, reject) => {
            if (typeof THREE.TDSLoader !== 'undefined') {
                console.log('✅ TDSLoader уже доступен');
                resolve();
                return;
            }

            console.log('🔄 Загружаем TDSLoader для .3ds файла...');
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/TDSLoader.js';
            
            script.onload = () => {
                let attempts = 0;
                const checkLoader = () => {
                    attempts++;
                    if (typeof THREE.TDSLoader !== 'undefined') {
                        console.log('✅ TDSLoader готов для загрузки .3ds');
                        resolve();
                    } else if (attempts < 20) {
                        setTimeout(checkLoader, 100);
                    } else {
                        reject(new Error('TDSLoader не стал доступен'));
                    }
                };
                setTimeout(checkLoader, 100);
            };
            
            script.onerror = () => reject(new Error('Ошибка загрузки TDSLoader'));
            document.head.appendChild(script);
        });
    }

    loadRaf3DS(loadingManager) {
        const loader = new THREE.TDSLoader(loadingManager);
        
        // Устанавливаем базовый путь к ВАШИМ файлам
        loader.setResourcePath('./Models/');
        
        console.log('🔍 Загружаем raf22031.3ds из папки Models/...');
        
        loader.load(
            './Models/raf22031.3ds',
            (object) => {
                console.log('🎉 RAF22031.3DS ЗАГРУЖЕН УСПЕШНО!');
                console.log('📊 Объект РАФика:', object);
                this.setupRaf(object);
            },
            (progress) => {
                if (progress.total > 0) {
                    const percent = (progress.loaded / progress.total * 100).toFixed(1);
                    console.log(`⏳ Загрузка raf22031.3ds: ${percent}%`);
                }
            },
            (error) => {
                console.error('❌ Ошибка загрузки raf22031.3ds:', error);
                console.log('🔄 Пробуем альтернативный способ - создание простого РАФика...');
                this.createProperRaf();
            }
        );
    }

    // Новый метод - создание правильного РАФика если .3ds не работает
    createProperRaf() {
        console.log('🔧 Создаем правильную модель РАФ-22031...');
        
        const group = new THREE.Group();
        const textureLoader = new THREE.TextureLoader();
        
        // Загружаем текстуру
        textureLoader.load('./Models/raf22031.JPG', 
            (texture) => {
                console.log('🖼️ Текстура загружена для создания РАФика');
                
                texture.flipY = false;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                
                const material = new THREE.MeshPhongMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });
                
                this.buildRafGeometry(group, material);
            },
            undefined,
            () => {
                console.log('⚠️ Текстура не загрузилась, создаем цветного РАФика');
                const materials = {
                    body: new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 50 }),
                    red: new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 30 }),
                    black: new THREE.MeshPhongMaterial({ color: 0x333333, shininess: 20 }),
                    glass: new THREE.MeshPhongMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.7 })
                };
                
                this.buildRafGeometry(group, materials);
            }
        );
    }

    buildRafGeometry(group, materials) {
        // Основной кузов РАФика
        const bodyGeometry = new THREE.BoxGeometry(5, 2, 2.2);
        const bodyMaterial = materials.body || materials;
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        group.add(body);
        
        // Кабина водителя
        const cabGeometry = new THREE.BoxGeometry(2.2, 1.8, 2.2);
        const cabMaterial = materials.body || materials;
        const cab = new THREE.Mesh(cabGeometry, cabMaterial);
        cab.position.set(-2, 2.4, 0);
        group.add(cab);
        
        // Красные полосы (как на реальном РАФе)
        const stripeGeometry = new THREE.BoxGeometry(4.8, 0.3, 0.05);
        const stripeMaterial = materials.red || new THREE.MeshPhongMaterial({ color: 0xff0000 });
        
        // Верхняя полоса
        const stripe1 = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe1.position.set(0, 1.5, 1.15);
        group.add(stripe1);
        
        // Нижняя полоса
        const stripe2 = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe2.position.set(0, 0.5, 1.15);
        group.add(stripe2);
        
        // Полосы с другой стороны
        const stripe3 = stripe1.clone();
        stripe3.position.z = -1.15;
        group.add(stripe3);
        
        const stripe4 = stripe2.clone();
        stripe4.position.z = -1.15;
        group.add(stripe4);
        
        // Колеса
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
        const wheelMaterial = materials.black || new THREE.MeshPhongMaterial({ color: 0x333333 });
        
        const wheelPositions = [
            [-1.8, 0.5, -1.4],
            [-1.8, 0.5, 1.4],
            [1.8, 0.5, -1.4],
            [1.8, 0.5, 1.4]
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(...pos);
            wheel.rotation.z = Math.PI / 2;
            group.add(wheel);
        });
        
        // Стекла
        const glassGeometry = new THREE.PlaneGeometry(1.8, 1.4);
        const glassMaterial = materials.glass || new THREE.MeshPhongMaterial({ 
            color: 0x87ceeb, 
            transparent: true, 
            opacity: 0.7 
        });
        
        // Лобовое стекло
        const windshield = new THREE.Mesh(glassGeometry, glassMaterial);
        windshield.position.set(-2, 2.4, 1.15);
        group.add(windshield);
        
        // Устанавливаем РАФик
        this.ambulance = group;
        this.ambulance.scale.set(0.8, 0.8, 0.8);
        this.ambulance.position.y = 0;
        
        this.scene.add(this.ambulance);
        this.addRafLights();
        
        console.log('✅ Правильный РАФ-22031 создан!');
    }

    setupRaf(object) {
        this.ambulance = object;
        
        console.log('🎨 Настройка РАФика с правильными текстурами...');
        
        // Автомасштабирование
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxSize;
        
        this.ambulance.scale.setScalar(scale);
        
        // Центрирование
        const center = box.getCenter(new THREE.Vector3());
        this.ambulance.position.sub(center.multiplyScalar(scale));
        this.ambulance.position.y = 0;
        
        // ВАЖНО: правильная ориентация для РАФа
        this.ambulance.rotation.x = 0;
        this.ambulance.rotation.y = 0; // Попробуйте Math.PI если смотрит не туда
        this.ambulance.rotation.z = 0;
        
        // Обработка всех материалов с исправлением текстур
        let meshCount = 0;
        this.ambulance.traverse((child) => {
            if (child.isMesh) {
                meshCount++;
                child.castShadow = true;
                child.receiveShadow = true;
                
                console.log(`🔍 Обрабатываем меш ${meshCount}: "${child.name || 'без имени'}"`);
                
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((material, index) => {
                            this.enhanceRafMaterial(material, `${child.name}_${index}`);
                        });
                    } else {
                        this.enhanceRafMaterial(child.material, child.name);
                    }
                }
            }
        });
        
        // Принудительное обновление всех материалов через секунду
        setTimeout(() => {
            this.ambulance.traverse((child) => {
                if (child.isMesh && child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => {
                            mat.needsUpdate = true;
                            if (mat.map) mat.map.needsUpdate = true;
                        });
                    } else {
                        child.material.needsUpdate = true;
                        if (child.material.map) child.material.map.needsUpdate = true;
                    }
                }
            });
            console.log('🔄 Принудительное обновление материалов выполнено');
        }, 1000);
        
        console.log(`📊 Обработано ${meshCount} мешей РАФика`);
        
        this.scene.add(this.ambulance);
        this.addRafLights();
        
        console.log('✅ РАФ-22031 готов к показу с правильными текстурами!');
    }

    enhanceRafMaterial(material, name) {
        if (!material) return;
        
        console.log(`🔧 КАРДИНАЛЬНО исправляем материал "${name}":`, material);
        
        // ПРИНУДИТЕЛЬНО заменяем материал на новый с правильными настройками
        const textureLoader = new THREE.TextureLoader();
        
        // Пробуем загрузить текстуру синхронно
        Promise.all([
            new Promise((resolve) => {
                textureLoader.load('./Models/raf22031.JPG', resolve, undefined, () => resolve(null));
            }),
            new Promise((resolve) => {
                textureLoader.load('./Models/raf22031.bmp', resolve, undefined, () => resolve(null));
            })
        ]).then(([jpgTexture, bmpTexture]) => {
            const texture = jpgTexture || bmpTexture;
            
            if (texture) {
                console.log(`🖼️ Применяем текстуру к "${name}"`);
                
                // ПРАВИЛЬНЫЕ настройки текстуры
                texture.flipY = true; // Пробуем с true
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.generateMipmaps = false;
                
                // Полностью заменяем материал
                const newMaterial = new THREE.MeshPhongMaterial({
                    map: texture,
                    color: 0xffffff,
                    shininess: 30,
                    side: THREE.DoubleSide,
                    transparent: false
                });
                
                // Применяем новый материал к мешу
                if (material.parent) {
                    material.parent.material = newMaterial;
                } else {
                    // Копируем свойства в существующий материал
                    material.map = texture;
                    material.color.setRGB(1, 1, 1);
                    material.shininess = 30;
                    material.side = THREE.DoubleSide;
                    material.transparent = false;
                    material.needsUpdate = true;
                }
                
                console.log(`✅ Новый материал применен к "${name}"`);
            } else {
                console.log(`⚠️ Текстуры не найдены для "${name}", используем цветной материал`);
                
                // Создаем цветной материал по имени меша
                let color = 0xffffff; // Белый по умолчанию
                
                if (name && typeof name === 'string') {
                    const lowerName = name.toLowerCase();
                    if (lowerName.includes('red') || lowerName.includes('краcн')) color = 0xff0000;
                    if (lowerName.includes('blue') || lowerName.includes('син")) color = 0x0000ff;
                    if (lowerName.includes('black') || lowerName.includes('черн')) color = 0x333333;
                    if (lowerName.includes('white') || lowerName.includes('бел")) color = 0xffffff;
                    if (lowerName.includes('body') || lowerName.includes('кузов")) color = 0xf0f0f0;
                    if (lowerName.includes('glass') || lowerName.includes('стекло")) color = 0x87ceeb;
                }
                
                material.color.setHex(color);
                material.shininess = 50;
                material.side = THREE.DoubleSide;
                material.transparent = false;
                material.needsUpdate = true;
            }
        });
    }

    loadRafTextureFixed(material, name) {
        const textureLoader = new THREE.TextureLoader();
        
        // Пробуем загрузить основную текстуру РАФа
        textureLoader.load(
            './Models/raf22031.JPG',
            (texture) => {
                console.log(`🖼️ Загружена JPG текстура для "${name}"`);
                
                // ПРАВИЛЬНЫЕ настройки для .3ds текстур
                texture.flipY = false; // КРИТИЧЕСКИ ВАЖНО для .3ds
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.generateMipmaps = false;
                texture.colorSpace = THREE.SRGBColorSpace;
                
                // Применяем к материалу
                material.map = texture;
                material.needsUpdate = true;
                
                console.log(`✅ Текстура применена к "${name}"`);
            },
            undefined,
            (error) => {
                console.log(`⚠️ JPG не загрузилась, пробуем BMP для "${name}"`);
                
                // Fallback на BMP
                textureLoader.load(
                    './Models/raf22031.bmp',
                    (texture) => {
                        console.log(`🖼️ Загружена BMP текстура для "${name}"`);
                        
                        // Те же настройки для BMP
                        texture.flipY = false;
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.minFilter = THREE.LinearFilter;
                        texture.magFilter = THREE.LinearFilter;
                        texture.generateMipmaps = false;
                        texture.colorSpace = THREE.SRGBColorSpace;
                        
                        material.map = texture;
                        material.needsUpdate = true;
                        
                        console.log(`✅ BMP текстура применена к "${name}"`);
                    },
                    undefined,
                    (error) => {
                        console.log(`❌ Не удалось загрузить текстуры для "${name}"`);
                    }
                );
            }
        );
    }

    addRafLights() {
        if (!this.ambulance) return;
        
        console.log('🚨 Добавляем мигалки на РАФ...');
        
        const lightGeometry = new THREE.SphereGeometry(0.08, 12, 12);
        
        const blueMaterial = new THREE.MeshPhongMaterial({
            color: 0x0066ff,
            emissive: 0x003388,
            shininess: 100
        });
        
        const redMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            emissive: 0x880000,
            shininess: 100
        });
        
        const box = new THREE.Box3().setFromObject(this.ambulance);
        const size = box.getSize(new THREE.Vector3());
        
        this.emergencyLights = [];
        
        // Мигалки на крыше РАФа
        for (let i = 0; i < 6; i++) {
            const isBlue = i % 2 === 0;
            const material = isBlue ? blueMaterial.clone() : redMaterial.clone();
            const light = new THREE.Mesh(lightGeometry, material);
            
            const angle = (i / 6) * Math.PI * 2;
            light.position.set(
                Math.cos(angle) * size.x * 0.2,
                size.y * 0.8,
                Math.sin(angle) * size.z * 0.2
            );
            
            this.ambulance.add(light);
            this.emergencyLights.push(light);
        }
        
        console.log('🚨 Мигалки РАФа добавлены');
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        if (this.ambulance) {
            // Легкое вращение РАФа
            this.ambulance.rotation.y = Math.sin(time * 0.2) * 0.1;
            
            // Мигание огней РАФа
            if (this.emergencyLights && this.emergencyLights.length > 0) {
                this.emergencyLights.forEach((light, index) => {
                    if (light.material) {
                        const intensity = Math.sin(time * 8 + index * Math.PI) > 0 ? 0.8 : 0.1;
                        light.material.emissive.setScalar(intensity * 0.5);
                    }
                });
            }
        }
        
        // Движение камеры вокруг РАФа
        this.camera.position.x = 8 + Math.sin(time * 0.3) * 0.5;
        this.camera.position.y = 3 + Math.sin(time * 0.4) * 0.2;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// ПРИНУДИТЕЛЬНЫЙ автозапуск (DOM уже загружен к моменту загрузки этого скрипта)
console.log('🚑 ПРИНУДИТЕЛЬНЫЙ запуск РАФ-22031...');

function forceStartAmbulance() {
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js не загружен!');
        return false;
    }
    
    if (window.ambulanceBackground) {
        console.log('⚠️ 3D РАФик уже создан');
        return true;
    }
    
    try {
        console.log('🚑 Создаем SimpleAmbulanceBackground...');
        window.ambulanceBackground = new SimpleAmbulanceBackground();
        console.log('✅ РАФ-22031 создан с исправленными текстурами!');
        return true;
    } catch (error) {
        console.error('❌ Ошибка создания РАФа:', error);
        return false;
    }
}

// Запускаем немедленно
setTimeout(forceStartAmbulance, 100);

// Дублируем для надежности
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceStartAmbulance);
} else {
    // DOM уже загружен
    setTimeout(forceStartAmbulance, 200);
}

// Третья попытка через секунду
setTimeout(() => {
    if (!window.ambulanceBackground) {
        console.log('🔄 Финальная попытка запуска 3D РАФика...');
        forceStartAmbulance();
    }
}, 1000);

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
    forceStart: () => {
        console.log('🔧 Принудительный запуск 3D РАФика...');
        return forceStartAmbulance();
    },
    
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
            console.log('✅ Модель РАФика загружена');
            console.log('Позиция:', window.ambulanceBackground.ambulance.position);
            console.log('Масштаб:', window.ambulanceBackground.ambulance.scale);
            console.log('Поворот:', window.ambulanceBackground.ambulance.rotation);
            console.log('Структура:', window.ambulanceBackground.ambulance);
            
            // Информация о материалах
            let materialCount = 0;
            window.ambulanceBackground.ambulance.traverse((child) => {
                if (child.isMesh) {
                    materialCount++;
                    console.log(`Материал ${materialCount}:`, child.material);
                    if (child.material && child.material.map) {
                        console.log(`Текстура ${materialCount}:`, child.material.map);
                    }
                }
            });
        } else {
            console.log('❌ Модель РАФика НЕ загружена');
            console.log('Попробуйте: window.debugAmbulance.forceStart()');
        }
    },
    
    testPaths: () => {
        const paths = [
            './Models/raf22031.3ds',
            './Models/raf22031.JPG',
            './Models/raf22031.bmp'
        ];
        
        console.log('🔍 Тестируем пути к файлам РАФика:');
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
        console.log('=== ДИАГНОСТИКА РАФ-22031 ===');
        window.debugAmbulance.checkThreeJS();
        window.debugAmbulance.check3DSLoader();
        window.debugAmbulance.checkModel();
        console.log('Принудительный запуск: window.debugAmbulance.forceStart()');
        console.log('Проверка путей: window.debugAmbulance.testPaths()');
    }
};

console.log('✅ 3D РАФ-22031 с исправленными текстурами готов к загрузке');
console.log('🐛 Диагностика: window.debugAmbulance.info()');
console.log('🔍 Проверка путей: window.debugAmbulance.testPaths()');
