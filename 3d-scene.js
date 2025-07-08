// ПРАВИЛЬНЫЙ 3d-scene.js с использованием ВСЕХ ваших файлов
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
        console.log('🚑 Загружаем РАФик с ВАШИМИ файлами из Models/...');
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
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(10, 10, 5);
        sunLight.castShadow = true;
        this.scene.add(sunLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const frontLight = new THREE.DirectionalLight(0xffffff, 0.6);
        frontLight.position.set(0, 5, 10);
        this.scene.add(frontLight);
    }

    loadAmbulance() {
        console.log('📦 Загружаем РАФик из ваших файлов: raf22031.3ds, raf22031.JPG, raf22031.bmp...');
        
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
        
        console.log('🎨 Настройка загруженного РАФика...');
        
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
        
        // Обработка материалов РАФика
        let meshCount = 0;
        this.ambulance.traverse((child) => {
            if (child.isMesh) {
                meshCount++;
                child.castShadow = true;
                child.receiveShadow = true;
                
                console.log(`🔍 Меш ${meshCount}: "${child.name || 'без имени'}"`, child.material);
                
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
        
        console.log(`📊 Обработано ${meshCount} мешей РАФика`);
        
        this.scene.add(this.ambulance);
        this.addRafLights();
        
        console.log('✅ РАФ-22031 готов к показу!');
    }

    enhanceRafMaterial(material, name) {
        if (!material) return;
        
        console.log(`🔧 Обрабатываем материал РАФика "${name}":`, material);
        
        // Базовые настройки для .3ds материалов
        material.side = THREE.DoubleSide;
        material.needsUpdate = true;
        
        // Если есть текстура
        if (material.map) {
            console.log('🖼️ У материала есть текстура:', material.map.image?.src || 'загружается...');
            material.map.needsUpdate = true;
            material.map.flipY = false; // Важно для .3ds
            material.map.minFilter = THREE.LinearMipMapLinearFilter;
            material.map.magFilter = THREE.LinearFilter;
            material.map.generateMipmaps = true;
        } else {
            console.log(`📝 Нет текстуры для "${name}", попробуем загрузить вручную`);
            this.loadRafTexture(material, name);
        }
        
        // Улучшаем освещение материала
        if (material.shininess !== undefined) {
            material.shininess = Math.max(material.shininess, 30);
        }
        
        // Если материал слишком темный или черный
        if (material.color) {
            const brightness = material.color.r + material.color.g + material.color.b;
            if (brightness < 0.3) {
                console.log(`💡 Осветляем темный материал "${name}"`);
                material.color.setRGB(0.8, 0.8, 0.8); // Делаем светлее
            }
        }
    }

    loadRafTexture(material, name) {
        const textureLoader = new THREE.TextureLoader();
        
        // ВАШИ конкретные файлы текстур
        const rafTextures = [
            './Models/raf22031.JPG',
            './Models/raf22031.bmp'
        ];
        
        rafTextures.forEach(texturePath => {
            textureLoader.load(
                texturePath,
                (texture) => {
                    console.log(`🖼️ Загружена текстура РАФика: ${texturePath} для материала "${name}"`);
                    texture.flipY = false;
                    texture.minFilter = THREE.LinearMipMapLinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    texture.generateMipmaps = true;
                    
                    // Применяем текстуру
                    material.map = texture;
                    material.needsUpdate = true;
                },
                undefined,
                (error) => {
                    console.log(`⚠️ Не удалось загрузить ${texturePath}:`, error.message);
                }
            );
        });
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
    console.log('🚑 Запуск РАФ-22031 с вашими файлами...');
    
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js не загружен!');
        return;
    }
    
    setTimeout(() => {
        try {
            window.ambulanceBackground = new SimpleAmbulanceBackground();
            console.log('✅ РАФ-22031 создан с вашими файлами!');
        } catch (error) {
            console.error('❌ Ошибка создания РАФа:', error);
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

console.log('✅ 3D РАФ-22031 готов к загрузке с ВАШИМИ файлами');
