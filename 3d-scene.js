// ИСПРАВЛЕННЫЙ 3d-scene.js с ПРАВИЛЬНОЙ загрузкой текстур
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
        console.log('🚑 Загружаем РАФик с текстурами...');
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
        // Яркое освещение для лучшей видимости
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
        sunLight.position.set(10, 10, 5);
        sunLight.castShadow = true;
        this.scene.add(sunLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);

        const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
        frontLight.position.set(0, 5, 10);
        this.scene.add(frontLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
        backLight.position.set(0, 5, -10);
        this.scene.add(backLight);
    }

    loadAmbulance() {
        console.log('📦 Загружаем РАФик с текстурами...');
        
        // Создаем загрузчик с правильной настройкой для текстур
        const loadingManager = new THREE.LoadingManager();
        
        // ВАЖНО: настройка путей к текстурам
        loadingManager.setURLModifier((url) => {
            console.log('🔍 Запрос файла:', url);
            
            // Если это текстура (.jpg, .bmp, .png)
            if (url.match(/\.(jpg|jpeg|png|bmp|tga|dds)$/i)) {
                const filename = url.split('/').pop().split('\\').pop();
                const texturePath = './Models/' + filename;
                console.log('🖼️ Перенаправляем текстуру:', texturePath);
                return texturePath;
            }
            return url;
        });
        
        loadingManager.onLoad = () => {
            console.log('✅ Все ресурсы (включая текстуры) загружены!');
        };
        
        loadingManager.onProgress = (url, loaded, total) => {
            console.log(`⏳ Загружено ${loaded}/${total}: ${url}`);
        };
        
        loadingManager.onError = (url) => {
            console.error('❌ Ошибка загрузки:', url);
        };
        
        this.loadTDSLoader()
            .then(() => {
                this.loadOriginal3DS(loadingManager);
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

            console.log('🔄 Загружаем TDSLoader...');
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/TDSLoader.js';
            
            script.onload = () => {
                let attempts = 0;
                const checkLoader = () => {
                    attempts++;
                    if (typeof THREE.TDSLoader !== 'undefined') {
                        console.log('✅ TDSLoader готов');
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

    loadOriginal3DS(loadingManager) {
        const loader = new THREE.TDSLoader(loadingManager);
        
        // Устанавливаем базовый путь для текстур
        loader.setResourcePath('./Models/');
        
        const paths = [
            './Models/raf22031.3ds',
            'Models/raf22031.3ds',
            './models/raf22031.3ds', 
            'models/raf22031.3ds'
        ];
        
        this.tryLoad3DS(loader, paths, 0);
    }

    tryLoad3DS(loader, paths, index) {
        if (index >= paths.length) {
            console.error('❌ НЕ УДАЛОСЬ ЗАГРУЗИТЬ .3DS ФАЙЛ!');
            return;
        }

        const currentPath = paths[index];
        console.log(`🔍 Пробуем загрузить: ${currentPath}`);
        
        loader.load(
            currentPath,
            (object) => {
                console.log('🎉 .3DS РАФИК ЗАГРУЖЕН!');
                this.setupOriginalAmbulance(object);
            },
            (progress) => {
                if (progress.total > 0) {
                    const percent = (progress.loaded / progress.total * 100).toFixed(1);
                    console.log(`⏳ Загрузка: ${percent}%`);
                }
            },
            (error) => {
                console.warn(`⚠️ Путь ${currentPath} не работает:`, error.message);
                this.tryLoad3DS(loader, paths, index + 1);
            }
        );
    }

    setupOriginalAmbulance(object) {
        this.ambulance = object;
        
        console.log('🎨 Настройка РАФика с текстурами...');
        console.log('📊 Структура модели:', object);
        
        // Автомасштабирование
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxSize; // Увеличили масштаб
        
        this.ambulance.scale.setScalar(scale);
        
        // Центрирование и размещение
        const center = box.getCenter(new THREE.Vector3());
        this.ambulance.position.sub(center.multiplyScalar(scale));
        this.ambulance.position.y = 1; // Поднимаем над землей
        
        // Поворот (если нужно)
        this.ambulance.rotation.y = Math.PI; // Поворачиваем если смотрит не туда
        
        // ВАЖНО: обработка материалов и текстур
        this.ambulance.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                console.log(`🔍 Меш: "${child.name || 'без имени'}", материал:`, child.material);
                
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((material, index) => {
                            console.log(`📐 Материал ${index}:`, material);
                            this.enhanceMaterial(material, child.name + '_' + index);
                        });
                    } else {
                        this.enhanceMaterial(child.material, child.name);
                    }
                } else {
                    console.log(`⚠️ Нет материала для "${child.name}"`);
                    // Создаем базовый материал
                    child.material = new THREE.MeshPhongMaterial({
                        color: 0xffffff,
                        shininess: 30
                    });
                }
            }
        });
        
        this.scene.add(this.ambulance);
        this.addMigalki();
        
        console.log('✅ РАФик с текстурами готов!');
    }

    enhanceMaterial(material, name) {
        if (!material) return;
        
        console.log(`🔧 Обрабатываем материал "${name}":`, material);
        
        // Базовые настройки
        material.side = THREE.DoubleSide;
        material.needsUpdate = true;
        
        // Если есть текстура
        if (material.map) {
            console.log('🖼️ Найдена текстура:', material.map);
            material.map.needsUpdate = true;
            material.map.flipY = false; // Для .3ds файлов
            material.map.minFilter = THREE.LinearMipMapLinearFilter;
            material.map.magFilter = THREE.LinearFilter;
            material.map.generateMipmaps = true;
        } else {
            console.log(`📝 Нет текстуры для материала "${name}"`);
            
            // Если нет текстуры, попробуем загрузить по имени
            this.tryLoadMissingTexture(material, name);
        }
        
        // Настройки освещения
        if (material.shininess !== undefined) {
            material.shininess = Math.max(material.shininess, 20);
        }
        
        // Если материал слишком темный
        if (material.color && (material.color.r + material.color.g + material.color.b) < 0.3) {
            console.log(`💡 Осветляем темный материал "${name}"`);
            material.color.multiplyScalar(2); // Делаем ярче
        }
    }

    tryLoadMissingTexture(material, name) {
        const textureLoader = new THREE.TextureLoader();
        
        // Возможные имена текстур
        const possibleTextures = [
            `./Models/raf22031.JPG`,
            `./Models/raf22031.jpg`,
            `./Models/raf22031.bmp`,
            `./Models/raf22031.BMP`,
            `./Models/raf22031.png`,
            `./Models/raf22031.PNG`
        ];
        
        possibleTextures.forEach(texturePath => {
            textureLoader.load(
                texturePath,
                (texture) => {
                    console.log(`🖼️ Загружена текстура: ${texturePath}`);
                    texture.flipY = false;
                    texture.minFilter = THREE.LinearMipMapLinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    material.map = texture;
                    material.needsUpdate = true;
                },
                undefined,
                (error) => {
                    // Тихо игнорируем ошибки - это нормально для проб
                }
            );
        });
    }

    addMigalki() {
        if (!this.ambulance) return;
        
        const lightGeometry = new THREE.SphereGeometry(0.1, 12, 12);
        
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
        
        // Мигалки на крыше
        for (let i = 0; i < 4; i++) {
            const isBlue = i % 2 === 0;
            const material = isBlue ? blueMaterial.clone() : redMaterial.clone();
            const light = new THREE.Mesh(lightGeometry, material);
            
            const angle = (i / 4) * Math.PI * 2;
            light.position.set(
                Math.cos(angle) * size.x * 0.15,
                size.y * 0.9,
                Math.sin(angle) * size.z * 0.15
            );
            
            this.ambulance.add(light);
            this.emergencyLights.push(light);
        }
        
        console.log('🚨 Добавлены мигалки');
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        if (this.ambulance) {
            // Легкое покачивание
            this.ambulance.rotation.y = Math.sin(time * 0.3) * 0.05;
            this.ambulance.position.y = 1 + Math.sin(time * 2) * 0.02;
            
            // Мигание огней
            if (this.emergencyLights && this.emergencyLights.length > 0) {
                this.emergencyLights.forEach((light, index) => {
                    if (light.material) {
                        const intensity = Math.sin(time * 12 + index * Math.PI) > 0 ? 1.0 : 0.1;
                        light.material.emissive.setScalar(intensity * 0.6);
                    }
                });
            }
        }
        
        // Движение камеры
        this.camera.position.x = 8 + Math.sin(time * 0.2) * 1;
        this.camera.position.y = 3 + Math.sin(time * 0.3) * 0.5;
        this.camera.position.z = 8 + Math.cos(time * 0.25) * 1;
        this.camera.lookAt(0, 1, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Автозапуск
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚑 Инициализация РАФика с текстурами...');
    
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js не загружен!');
        return;
    }
    
    setTimeout(() => {
        try {
            window.ambulanceBackground = new SimpleAmbulanceBackground();
            console.log('✅ РАФик с текстурами создан!');
        } catch (error) {
            console.error('❌ Ошибка:', error);
        }
    }, 500);
});

window.addEventListener('resize', function() {
    if (window.ambulanceBackground) {
        const bg = window.ambulanceBackground;
        bg.camera.aspect = window.innerWidth / window.innerHeight;
        bg.camera.updateProjectionMatrix();
        bg.renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

console.log('✅ 3D РАФик с текстурами готов к загрузке');
