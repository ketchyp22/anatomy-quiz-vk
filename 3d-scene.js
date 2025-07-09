// ИСПРАВЛЕННАЯ ВЕРСИЯ 3d-scene.js с правильным позиционированием и масштабированием
class SimpleAmbulanceBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.rafModel = null;
        this.emergencyLights = [];
        this.originalCameraPosition = { x: 8, y: 3, z: 8 };
        this.modelBoundingBox = null;
        this.modelCenter = null;
        this.init();
    }

    init() {
        console.log('🚑 ИСПРАВЛЕННАЯ загрузка РАФ-2031 с правильным позиционированием');
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLighting();
        this.loadOnlyRealModel();
        this.animate();
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 10, 100);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        
        // ИСПРАВЛЕННОЕ начальное позиционирование камеры
        this.camera.position.set(
            this.originalCameraPosition.x, 
            this.originalCameraPosition.y, 
            this.originalCameraPosition.z
        );
        
        // ЦЕНТРИРУЕМ взгляд камеры на центр сцены
        this.camera.lookAt(0, 0, 0);
        
        console.log('📷 Камера создана:', {
            position: this.camera.position,
            aspect: this.camera.aspect,
            fov: this.camera.fov
        });
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
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
            overflow: hidden;
        `;
        
        container.appendChild(this.renderer.domElement);
        document.body.appendChild(container);
        
        console.log('🖥️ Рендерер создан:', {
            size: { width: window.innerWidth, height: window.innerHeight },
            pixelRatio: this.renderer.getPixelRatio()
        });
    }

    createLighting() {
        // Основной солнечный свет
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(15, 20, 10);
        sunLight.castShadow = true;
        
        // УЛУЧШЕННЫЕ настройки теней
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 100;
        sunLight.shadow.camera.left = -20;
        sunLight.shadow.camera.right = 20;
        sunLight.shadow.camera.top = 20;
        sunLight.shadow.camera.bottom = -20;
        sunLight.shadow.bias = -0.0001;
        
        this.scene.add(sunLight);

        // Рассеянный свет для равномерного освещения
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Дополнительный заполняющий свет
        const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.4);
        fillLight.position.set(-10, 5, -10);
        this.scene.add(fillLight);
        
        console.log('💡 Освещение настроено');
    }

    loadOnlyRealModel() {
        console.log('🎯 ЗАГРУЖАЕМ ТОЛЬКО РЕАЛЬНУЮ МОДЕЛЬ raf2031.3ds');
        
        this.ensureTDSLoader().then(() => {
            console.log('✅ TDSLoader готов, загружаем .3ds файл');
            this.loadRealRaf();
        }).catch((error) => {
            console.error('❌ TDSLoader недоступен:', error);
        });
    }

    ensureTDSLoader() {
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
                console.log('📦 TDSLoader скрипт загружен');
                
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
        loader.setResourcePath('./Models/');
        
        loader.load(
            './Models/raf2031.3ds',
            (object) => {
                console.log('🎉 RAF2031.3DS ЗАГРУЖЕН!');
                this.setupLoadedModel(object);
            },
            (progress) => {
                if (progress.lengthComputable) {
                    const percent = (progress.loaded / progress.total * 100).toFixed(1);
                    console.log(`⏳ Загрузка: ${percent}%`);
                }
            },
            (error) => {
                console.error('❌ ОШИБКА ЗАГРУЗКИ .3DS ФАЙЛА:', error);
            }
        );
    }

    setupLoadedModel(object) {
        console.log('🎨 НАСТРАИВАЕМ ЗАГРУЖЕННУЮ МОДЕЛЬ С ПРАВИЛЬНЫМ ПОЗИЦИОНИРОВАНИЕМ...');
        
        this.rafModel = object;
        
        // Анализируем структуру модели
        let meshCount = 0;
        object.traverse((child) => {
            if (child.isMesh) {
                meshCount++;
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Улучшаем материалы
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => this.improveMaterial(mat));
                    } else {
                        this.improveMaterial(child.material);
                    }
                }
            }
        });
        
        console.log(`📊 Найдено мешей: ${meshCount}`);
        
        // ИСПРАВЛЕННОЕ позиционирование и масштабирование
        this.correctModelPositioning();
        
        // Загружаем текстуры
        this.loadTextures();
        
        // Добавляем в сцену
        this.scene.add(this.rafModel);
        
        // Добавляем мигалки
        this.addEmergencyLights();
        
        console.log('✅ МОДЕЛЬ РАФ-2031 ПРАВИЛЬНО ПОЗИЦИОНИРОВАНА И ГОТОВА!');
    }

    correctModelPositioning() {
        console.log('📐 ИСПРАВЛЯЕМ ПОЗИЦИОНИРОВАНИЕ И МАСШТАБИРОВАНИЕ...');
        
        // Вычисляем реальные границы модели
        this.modelBoundingBox = new THREE.Box3().setFromObject(this.rafModel);
        this.modelCenter = this.modelBoundingBox.getCenter(new THREE.Vector3());
        const modelSize = this.modelBoundingBox.getSize(new THREE.Vector3());
        
        console.log('📏 Исходные данные модели:', {
            center: this.modelCenter,
            size: modelSize,
            boundingBox: this.modelBoundingBox
        });
        
        // АДАПТИВНОЕ масштабирование в зависимости от размера экрана
        const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
        const screenFactor = Math.min(window.innerWidth, window.innerHeight) / 800;
        const baseScale = 3.5; // Базовый масштаб
        const adaptiveScale = baseScale * screenFactor;
        const finalScale = adaptiveScale / maxDimension;
        
        this.rafModel.scale.setScalar(finalScale);
        
        console.log('🔧 Применен адаптивный масштаб:', {
            maxDimension,
            screenFactor,
            adaptiveScale,
            finalScale
        });
        
        // ТОЧНОЕ ЦЕНТРИРОВАНИЕ модели
        // Сначала сбрасываем позицию
        this.rafModel.position.set(0, 0, 0);
        
        // Пересчитываем границы после масштабирования
        const scaledBox = new THREE.Box3().setFromObject(this.rafModel);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        const scaledSize = scaledBox.getSize(new THREE.Vector3());
        
        // Центрируем по X и Z, ставим на "землю" по Y
        this.rafModel.position.x = -scaledCenter.x;
        this.rafModel.position.z = -scaledCenter.z;
        this.rafModel.position.y = -scaledBox.min.y; // Ставим на уровень земли
        
        // ИСПРАВЛЯЕМ ОРИЕНТАЦИЮ (поворачиваем на 180° по Y)
        this.rafModel.rotation.x = 0;
        this.rafModel.rotation.y = Math.PI;
        this.rafModel.rotation.z = 0;
        
        console.log('📍 ИСПРАВЛЕННОЕ позиционирование:', {
            position: this.rafModel.position,
            rotation: this.rafModel.rotation,
            scale: this.rafModel.scale.x,
            scaledSize
        });
        
        // АДАПТИРУЕМ КАМЕРУ под размер модели
        this.adaptCameraToModel(scaledSize);
    }

    adaptCameraToModel(modelSize) {
        console.log('📷 АДАПТИРУЕМ КАМЕРУ под размер модели...');
        
        // Вычисляем оптимальное расстояние для камеры
        const maxSize = Math.max(modelSize.x, modelSize.y, modelSize.z);
        const distance = maxSize * 2.5; // Множитель для комфортного обзора
        
        // Обновляем исходную позицию камеры
        this.originalCameraPosition = {
            x: distance * 0.8,
            y: distance * 0.4,
            z: distance * 0.8
        };
        
        // Устанавливаем новую позицию
        this.camera.position.set(
            this.originalCameraPosition.x,
            this.originalCameraPosition.y,
            this.originalCameraPosition.z
        );
        
        // Направляем камеру на центр модели (который теперь в 0,0,0)
        this.camera.lookAt(0, modelSize.y / 2, 0);
        
        console.log('📷 Камера адаптирована:', {
            distance,
            position: this.camera.position,
            lookingAt: { x: 0, y: modelSize.y / 2, z: 0 }
        });
    }

    improveMaterial(material) {
        // Улучшаем качество материала
        material.side = THREE.DoubleSide;
        material.transparent = false;
        material.alphaTest = 0.1;
        
        // Добавляем металличность для реалистичности
        if (material.type === 'MeshStandardMaterial' || material.type === 'MeshPhysicalMaterial') {
            material.metalness = 0.1;
            material.roughness = 0.8;
        }
        
        material.needsUpdate = true;
    }

    loadTextures() {
        console.log('🖼️ ЗАГРУЖАЕМ ТЕКСТУРЫ...');
        
        const textureLoader = new THREE.TextureLoader();
        
        // Сначала пробуем JPG
        textureLoader.load(
            './Models/raf2031.JPG',
            (texture) => {
                console.log('✅ Текстура raf2031.JPG загружена');
                this.applyTextureToModel(texture);
            },
            undefined,
            (error) => {
                console.warn('⚠️ JPG текстура не загрузилась, пробуем BMP...');
                this.tryLoadBMP();
            }
        );
    }

    tryLoadBMP() {
        const textureLoader = new THREE.TextureLoader();
        
        textureLoader.load(
            './Models/raf2031.bmp',
            (texture) => {
                console.log('✅ Текстура raf2031.bmp загружена');
                this.applyTextureToModel(texture);
            },
            undefined,
            (error) => {
                console.warn('⚠️ BMP текстура тоже не загрузилась');
            }
        );
    }

    applyTextureToModel(texture) {
        console.log('🎨 ПРИМЕНЯЕМ ТЕКСТУРУ К МОДЕЛИ...');
        
        // Настройки текстуры
        texture.flipY = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        
        // Применяем ко всем мешам
        let texturedMeshes = 0;
        this.rafModel.traverse((child) => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => {
                        mat.map = texture;
                        mat.color.setRGB(1, 1, 1);
                        mat.needsUpdate = true;
                    });
                } else {
                    child.material.map = texture;
                    child.material.color.setRGB(1, 1, 1);
                    child.material.needsUpdate = true;
                }
                texturedMeshes++;
            }
        });
        
        console.log(`✅ Текстура применена к ${texturedMeshes} мешам`);
    }

    addEmergencyLights() {
        if (!this.rafModel) return;
        
        console.log('🚨 ДОБАВЛЯЕМ МИГАЛКИ...');
        
        const lightGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const blueMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x0066ff, 
            emissive: 0x003388,
            transparent: true,
            opacity: 0.9
        });
        const redMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff0000, 
            emissive: 0x660000,
            transparent: true,
            opacity: 0.9
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
                Math.cos(angle) * size.x * 0.25,
                size.y * 0.9,
                Math.sin(angle) * size.z * 0.25
            );
            
            this.rafModel.add(light);
            this.emergencyLights.push(light);
        }
        
        console.log(`🚨 Добавлено ${this.emergencyLights.length} мигалок`);
    }

    onWindowResize() {
        console.log('🔄 Обработка изменения размера окна...');
        
        // Обновляем камеру
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Обновляем рендерер
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // ПЕРЕСЧИТЫВАЕМ позиционирование модели для нового размера экрана
        if (this.rafModel) {
            this.correctModelPositioning();
        }
        
        console.log('✅ Размер обновлен:', {
            size: { width: window.innerWidth, height: window.innerHeight },
            aspect: this.camera.aspect
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        if (this.rafModel) {
            // Мигание огней
            if (this.emergencyLights && this.emergencyLights.length > 0) {
                this.emergencyLights.forEach((light, index) => {
                    const intensity = Math.sin(time * 6 + index * Math.PI) > 0 ? 1 : 0.2;
                    light.material.emissive.multiplyScalar(intensity);
                });
            }
        }
        
        // ИСПРАВЛЕННОЕ плавное движение камеры вокруг модели
        if (this.originalCameraPosition) {
            const radius = Math.sqrt(
                this.originalCameraPosition.x * this.originalCameraPosition.x + 
                this.originalCameraPosition.z * this.originalCameraPosition.z
            );
            
            this.camera.position.x = this.originalCameraPosition.x + Math.sin(time * 0.15) * radius * 0.1;
            this.camera.position.y = this.originalCameraPosition.y + Math.sin(time * 0.2) * 0.5;
            this.camera.position.z = this.originalCameraPosition.z + Math.cos(time * 0.15) * radius * 0.1;
            
            // ВСЕГДА смотрим на центр модели
            this.camera.lookAt(0, this.originalCameraPosition.y * 0.3, 0);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// АВТОЗАПУСК
console.log('🚑 ЗАПУСК ИСПРАВЛЕННОЙ МОДЕЛИ РАФ-2031');

function startRealRaf() {
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js не загружен!');
        return false;
    }
    
    if (window.rafBackground) {
        console.log('⚠️ РАФ уже создан, пересоздаем...');
        // Удаляем старый контейнер
        const oldContainer = document.getElementById('threejs-container');
        if (oldContainer) {
            oldContainer.remove();
        }
    }
    
    try {
        window.rafBackground = new SimpleAmbulanceBackground();
        console.log('✅ ИСПРАВЛЕННАЯ система РАФ-2031 запущена');
        return true;
    } catch (error) {
        console.error('❌ Ошибка запуска:', error);
        return false;
    }
}

// Запускаем
setTimeout(startRealRaf, 100);

// УЛУЧШЕННЫЕ функции отладки
window.debugRaf = {
    start: startRealRaf,
    
    restart: () => {
        const oldContainer = document.getElementById('threejs-container');
        if (oldContainer) oldContainer.remove();
        startRealRaf();
    },
    
    checkFiles: async () => {
        const files = ['./Models/raf2031.3ds', './Models/raf2031.JPG', './Models/raf2031.bmp'];
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
        console.log('=== ДИАГНОСТИКА ИСПРАВЛЕННОГО РАФ-2031 ===');
        console.log('Three.js:', typeof THREE !== 'undefined' ? '✅' : '❌');
        console.log('TDSLoader:', typeof THREE?.TDSLoader !== 'undefined' ? '✅' : '❌');
        console.log('Модель загружена:', window.rafBackground?.rafModel ? '✅' : '❌');
        
        if (window.rafBackground?.rafModel) {
            const model = window.rafBackground.rafModel;
            console.log('Позиция модели:', model.position);
            console.log('Поворот модели:', model.rotation);
            console.log('Масштаб модели:', model.scale.x);
            console.log('Позиция камеры:', window.rafBackground.camera.position);
        }
    },
    
    centerModel: () => {
        if (window.rafBackground?.rafModel) {
            window.rafBackground.correctModelPositioning();
            console.log('🎯 Модель переcentrована');
        } else {
            console.log('❌ Модель не загружена');
        }
    },
    
    resetCamera: () => {
        if (window.rafBackground?.camera && window.rafBackground?.originalCameraPosition) {
            const pos = window.rafBackground.originalCameraPosition;
            window.rafBackground.camera.position.set(pos.x, pos.y, pos.z);
            window.rafBackground.camera.lookAt(0, 0, 0);
            console.log('📷 Камера сброшена');
        }
    }
};

console.log('✅ ИСПРАВЛЕННЫЙ код загружен с правильным позиционированием!');
console.log('🔧 Диагностика: window.debugRaf.info()');
console.log('🎯 Переcentрировать: window.debugRaf.centerModel()');
console.log('📷 Сбросить камеру: window.debugRaf.resetCamera()');
console.log('🔄 Перезапуск: window.debugRaf.restart()');
