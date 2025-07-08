// ТОЛЬКО ЗАГРУЗКА .3DS ФАЙЛА - НИКАКИХ РЕЗЕРВНЫХ МОДЕЛЕЙ!
class SimpleAmbulanceBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.rafModel = null;
        this.emergencyLights = [];
        this.init();
    }

    init() {
        console.log('🚑 ЗАГРУЖАЕМ ТОЛЬКО .3DS ФАЙЛ - БЕЗ АЛЬТЕРНАТИВ!');
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLighting();
        this.loadOnlyRealModel();
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
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
        sunLight.position.set(10, 10, 5);
        sunLight.castShadow = true;
        this.scene.add(sunLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);
    }

    loadOnlyRealModel() {
        console.log('🎯 ЗАГРУЖАЕМ ТОЛЬКО РЕАЛЬНУЮ МОДЕЛЬ raf2031.3ds');
        
        // Сначала убеждаемся что TDSLoader доступен
        this.ensureTDSLoader().then(() => {
            console.log('✅ TDSLoader готов, загружаем .3ds файл');
            this.loadRealRaf();
        }).catch((error) => {
            console.error('❌ TDSLoader недоступен:', error);
            console.error('❌ БЕЗ TDSLoader .3ds ФАЙЛ НЕ ЗАГРУЗИТСЯ!');
        });
    }

    ensureTDSLoader() {
        return new Promise((resolve, reject) => {
            // Если уже есть - отлично
            if (typeof THREE.TDSLoader !== 'undefined') {
                console.log('✅ TDSLoader уже доступен');
                resolve();
                return;
            }

            console.log('🔄 Загружаем TDSLoader...');
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/TDSLoader.js';
            
            script.onload = () => {
                console.log('📦 TDSLoader скрипт загружен');
                
                // Ждем когда станет доступен
                let attempts = 0;
                const checkLoader = () => {
                    attempts++;
                    if (typeof THREE.TDSLoader !== 'undefined') {
                        console.log('✅ TDSLoader готов к работе');
                        resolve();
                    } else if (attempts < 50) {
                        setTimeout(checkLoader, 100);
                    } else {
                        reject(new Error('TDSLoader не стал доступен после загрузки'));
                    }
                };
                setTimeout(checkLoader, 100);
            };
            
            script.onerror = () => {
                reject(new Error('Не удалось загрузить TDSLoader'));
            };
            
            document.head.appendChild(script);
        });
    }

    loadRealRaf() {
        console.log('🚑 ЗАГРУЖАЕМ raf2031.3ds...');
        
        const loader = new THREE.TDSLoader();
        
        // Настройки загрузчика
        loader.setResourcePath('./Models/');
        
        // Загружаем файл
        loader.load(
            './Models/raf22031.3ds',
            (object) => {
                console.log('🎉 RAF2031.3DS ЗАГРУЖЕН!');
                console.log('📊 Загруженный объект:', object);
                console.log('📊 Количество детей:', object.children.length);
                
                this.setupLoadedModel(object);
            },
            (progress) => {
                if (progress.lengthComputable) {
                    const percent = (progress.loaded / progress.total * 100).toFixed(1);
                    console.log(`⏳ Загрузка: ${percent}%`);
                } else {
                    console.log(`⏳ Загружено байт: ${progress.loaded}`);
                }
            },
            (error) => {
                console.error('❌ ОШИБКА ЗАГРУЗКИ .3DS ФАЙЛА:');
                console.error('❌ Ошибка:', error);
                console.error('❌ Проверьте:');
                console.error('   1. Файл ./Models/raf2031.3ds существует');
                console.error('   2. Файл не поврежден');
                console.error('   3. Путь правильный');
                console.error('   4. Нет CORS ошибок');
            }
        );
    }

    setupLoadedModel(object) {
        console.log('🎨 НАСТРАИВАЕМ ЗАГРУЖЕННУЮ МОДЕЛЬ...');
        
        this.rafModel = object;
        
        // Анализируем что загрузилось
        let meshCount = 0;
        object.traverse((child) => {
            if (child.isMesh) {
                meshCount++;
                console.log(`🔍 Меш ${meshCount}: "${child.name}"`);
                console.log(`   Геометрия:`, child.geometry);
                console.log(`   Материал:`, child.material);
                
                // Включаем тени
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        console.log(`📊 Всего найдено мешей: ${meshCount}`);
        
        // Масштабирование и позиционирование
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        
        console.log(`📏 Размер модели: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`);
        console.log(`📏 Максимальный размер: ${maxSize.toFixed(2)}`);
        
        // Масштабируем до разумного размера
        const scale = 4 / maxSize;
        this.rafModel.scale.setScalar(scale);
        console.log(`📏 Применен масштаб: ${scale.toFixed(3)}`);
        
        // Центрируем
        const center = box.getCenter(new THREE.Vector3());
        this.rafModel.position.sub(center.multiplyScalar(scale));
        this.rafModel.position.y = 0;
        
        console.log(`📍 Позиция модели: ${this.rafModel.position.x.toFixed(2)}, ${this.rafModel.position.y.toFixed(2)}, ${this.rafModel.position.z.toFixed(2)}`);
        
        // Загружаем текстуры
        this.loadTextures();
        
        // Добавляем в сцену
        this.scene.add(this.rafModel);
        
        // Добавляем мигалки
        this.addEmergencyLights();
        
        console.log('✅ МОДЕЛЬ РАФ-2031 ГОТОВА!');
    }

    loadTextures() {
        console.log('🖼️ ЗАГРУЖАЕМ ТЕКСТУРЫ...');
        
        const textureLoader = new THREE.TextureLoader();
        
        // Сначала пробуем JPG
        textureLoader.load(
            './Models/raf22031.JPG',
            (texture) => {
                console.log('✅ Текстура raf2031.JPG загружена');
                this.applyTextureToModel(texture);
            },
            (progress) => {
                console.log('⏳ Загрузка текстуры JPG...');
            },
            (error) => {
                console.warn('⚠️ JPG текстура не загрузилась, пробуем BMP...');
                this.tryLoadBMP();
            }
        );
    }

    tryLoadBMP() {
        const textureLoader = new THREE.TextureLoader();
        
        textureLoader.load(
            './Models/raf22031.bmp',
            (texture) => {
                console.log('✅ Текстура raf2031.bmp загружена');
                this.applyTextureToModel(texture);
            },
            (progress) => {
                console.log('⏳ Загрузка текстуры BMP...');
            },
            (error) => {
                console.warn('⚠️ BMP текстура тоже не загрузилась');
                console.warn('⚠️ Модель будет без текстур');
            }
        );
    }

    applyTextureToModel(texture) {
        console.log('🎨 ПРИМЕНЯЕМ ТЕКСТУРУ К МОДЕЛИ...');
        
        // Настройки текстуры
        texture.flipY = false;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        // Применяем ко всем мешам
        let texturedMeshes = 0;
        this.rafModel.traverse((child) => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        mat.map = texture;
                        mat.needsUpdate = true;
                    });
                } else {
                    child.material.map = texture;
                    child.material.needsUpdate = true;
                }
                texturedMeshes++;
                console.log(`🖼️ Текстура применена к мешу: ${child.name}`);
            }
        });
        
        console.log(`✅ Текстура применена к ${texturedMeshes} мешам`);
    }

    addEmergencyLights() {
        console.log('🚨 ДОБАВЛЯЕМ МИГАЛКИ...');
        
        const lightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const blueMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x0066ff, 
            emissive: 0x003388 
        });
        const redMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff0000, 
            emissive: 0x660000 
        });
        
        // Получаем размеры модели для размещения мигалок
        const box = new THREE.Box3().setFromObject(this.rafModel);
        const size = box.getSize(new THREE.Vector3());
        
        this.emergencyLights = [];
        
        // Добавляем мигалки на крышу
        for (let i = 0; i < 4; i++) {
            const material = i % 2 === 0 ? blueMaterial.clone() : redMaterial.clone();
            const light = new THREE.Mesh(lightGeometry, material);
            
            const angle = (i / 4) * Math.PI * 2;
            light.position.set(
                Math.cos(angle) * size.x * 0.3,
                size.y * 1.2,
                Math.sin(angle) * size.z * 0.3
            );
            
            this.rafModel.add(light);
            this.emergencyLights.push(light);
        }
        
        console.log(`🚨 Добавлено ${this.emergencyLights.length} мигалок`);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        if (this.rafModel) {
            // Легкое покачивание
            this.rafModel.rotation.y = Math.sin(time * 0.3) * 0.05;
            
            // Мигание огней
            if (this.emergencyLights) {
                this.emergencyLights.forEach((light, index) => {
                    const intensity = Math.sin(time * 6 + index * Math.PI) > 0 ? 1 : 0.1;
                    light.material.emissive.multiplyScalar(intensity);
                });
            }
        }
        
        // Движение камеры
        this.camera.position.x = 8 + Math.sin(time * 0.2) * 1;
        this.camera.position.y = 3 + Math.sin(time * 0.3) * 0.5;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// АВТОЗАПУСК
console.log('🚑 ЗАПУСК ТОЛЬКО РЕАЛЬНОЙ МОДЕЛИ РАФ-2031');

function startRealRaf() {
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js не загружен!');
        return false;
    }
    
    if (window.rafBackground) {
        console.log('⚠️ РАФ уже создан');
        return true;
    }
    
    try {
        window.rafBackground = new SimpleAmbulanceBackground();
        console.log('✅ Система загрузки РАФ-2031 запущена');
        return true;
    } catch (error) {
        console.error('❌ Ошибка запуска:', error);
        return false;
    }
}

// Запускаем
setTimeout(startRealRaf, 100);

// Функции отладки
window.debugRaf = {
    start: startRealRaf,
    
    checkFiles: async () => {
        const files = ['./Models/raf22031.3ds', './Models/raf22031.JPG', './Models/raf22031.bmp'];
        for (const file of files) {
            try {
                const response = await fetch(file, { method: 'HEAD' });
                console.log(`${response.ok ? '✅' : '❌'} ${file} - ${response.status}`);
            } catch (error) {
                console.log(`❌ ${file} - Ошибка: ${error.message}`);
            }
        }
    },
    
    info: () => {
        console.log('=== ДИАГНОСТИКА РАФ-2031 ===');
        console.log('Three.js:', typeof THREE !== 'undefined' ? '✅' : '❌');
        console.log('TDSLoader:', typeof THREE?.TDSLoader !== 'undefined' ? '✅' : '❌');
        console.log('Модель загружена:', window.rafBackground?.rafModel ? '✅' : '❌');
        console.log('Проверка файлов: window.debugRaf.checkFiles()');
    }
};

console.log('✅ Код загружен - ТОЛЬКО .3DS ФАЙЛ!');
console.log('🔧 Диагностика: window.debugRaf.info()');
console.log('📁 Проверка файлов: window.debugRaf.checkFiles()');
