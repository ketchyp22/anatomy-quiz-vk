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
                console.error('🔍 Убедитесь что файл ./Models/raf22031.3ds доступен');
            }
        );
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
        
        console.log(`🔧 Исправляем наложение текстур для "${name}":`, material);
        
        // Базовые настройки для .3ds материалов
        material.side = THREE.DoubleSide;
        material.needsUpdate = true;
        
        // Если есть текстура - исправляем ее настройки
        if (material.map) {
            console.log('🖼️ Исправляем существующую текстуру');
            
            // ВАЖНЫЕ настройки для правильного отображения .3ds текстур
            material.map.needsUpdate = true;
            material.map.flipY = false; // Для .3ds файлов ОБЯЗАТЕЛЬНО
            material.map.wrapS = THREE.RepeatWrapping;
            material.map.wrapT = THREE.RepeatWrapping;
            
            // Фильтрация для четкости
            material.map.minFilter = THREE.LinearFilter;
            material.map.magFilter = THREE.LinearFilter;
            material.map.generateMipmaps = false; // Отключаем для лучшего результата
            
            // Цветовое пространство
            material.map.colorSpace = THREE.SRGBColorSpace;
            
        } else {
            console.log(`📝 Загружаем текстуру для "${name}"`);
            this.loadRafTextureFixed(material, name);
        }
        
        // Настройки материала для лучшего отображения
        material.shininess = 30;
        material.transparent = false;
        material.alphaTest = 0;
        
        // Обеспечиваем правильные цвета
        if (material.color) {
            // Не меняем цвет если есть текстура
            if (!material.map) {
                material.color.setRGB(1, 1, 1); // Белый базовый цвет
            }
        }
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

// Автозапуск
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚑 Запуск РАФ-22031 с исправленными текстурами...');
    
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js не загружен!');
        return;
    }
    
    setTimeout(() => {
        try {
            window.ambulanceBackground = new SimpleAmbulanceBackground();
            console.log('✅ РАФ-22031 создан с исправленными текстурами!');
        } catch (error) {
            console.error('❌ Ошибка создания РАФа:', error);
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
        console.log('Для проверки путей: window.debugAmbulance.testPaths()');
    }
};

console.log('✅ 3D РАФ-22031 с исправленными текстурами готов к загрузке');
console.log('🐛 Диагностика: window.debugAmbulance.info()');
console.log('🔍 Проверка путей: window.debugAmbulance.testPaths()');
