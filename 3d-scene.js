// ИСПРАВЛЕННЫЙ 3d-scene.js - ТОЛЬКО оригинальный .3ds файл
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
        console.log('🚑 Загружаем ТОЛЬКО оригинальный .3ds РАФик...');
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
        console.log('📦 Загружаем ТОЛЬКО ваш оригинальный .3ds РАФик...');
        
        this.loadTDSLoader()
            .then(() => {
                this.loadOriginal3DS();
            })
            .catch((error) => {
                console.error('❌ Не удалось загрузить TDSLoader:', error);
                console.log('🚫 Без TDSLoader невозможно загрузить .3ds файл');
            });
    }

    loadTDSLoader() {
        return new Promise((resolve, reject) => {
            if (typeof THREE.TDSLoader !== 'undefined') {
                console.log('✅ TDSLoader уже доступен');
                resolve();
                return;
            }

            console.log('🔄 Загружаем TDSLoader для .3ds файлов...');
            
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

    loadOriginal3DS() {
        const loader = new THREE.TDSLoader();
        
        // Пути к ВАШЕМУ оригинальному файлу
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
            console.error('❌ НЕ УДАЛОСЬ ЗАГРУЗИТЬ ОРИГИНАЛЬНЫЙ .3DS ФАЙЛ!');
            console.error('🔍 Проверьте:');
            console.error('1. Файл raf22031.3ds существует в папке Models/');
            console.error('2. Сервер запущен и файлы доступны');
            console.error('3. Нет ошибок CORS');
            return;
        }

        const currentPath = paths[index];
        console.log(`🔍 Пробуем загрузить: ${currentPath}`);
        
        loader.load(
            currentPath,
            (object) => {
                console.log('🎉 ОРИГИНАЛЬНЫЙ .3DS РАФИК ЗАГРУЖЕН!');
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
        
        console.log('🎨 Настройка оригинального РАФика...');
        
        // Автомасштабирование
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxSize;
        
        this.ambulance.scale.setScalar(scale);
        
        // Центрирование
        const center = box.getCenter(new THREE.Vector3());
        this.ambulance.position.sub(center.multiplyScalar(scale));
        this.ambulance.position.y = 0;
        
        // Настройка материалов (сохраняем оригинальные)
        this.ambulance.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => this.enhanceMaterial(material));
                    } else {
                        this.enhanceMaterial(child.material);
                    }
                }
            }
        });
        
        this.scene.add(this.ambulance);
        this.addMigalki();
        
        console.log('✅ Оригинальный РАФик готов!');
    }

    enhanceMaterial(material) {
        if (!material) return;
        
        material.side = THREE.DoubleSide;
        material.needsUpdate = true;
        
        if (material.map) {
            material.map.needsUpdate = true;
            material.map.flipY = false;
            material.map.minFilter = THREE.LinearMipMapLinearFilter;
            material.map.magFilter = THREE.LinearFilter;
        }
    }

    addMigalki() {
        if (!this.ambulance) return;
        
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
        
        console.log('🚨 Добавлены мигалки');
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        if (this.ambulance) {
            this.ambulance.rotation.y = Math.sin(time * 0.2) * 0.1;
            
            if (this.emergencyLights && this.emergencyLights.length > 0) {
                this.emergencyLights.forEach((light, index) => {
                    if (light.material) {
                        const intensity = Math.sin(time * 8 + index * Math.PI) > 0 ? 0.8 : 0.1;
                        light.material.emissive.setScalar(intensity * 0.5);
                    }
                });
            }
        }
        
        this.camera.position.x = 8 + Math.sin(time * 0.3) * 0.5;
        this.camera.position.y = 3 + Math.sin(time * 0.4) * 0.2;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Автозапуск
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚑 Инициализация фона с ОРИГИНАЛЬНЫМ .3ds РАФиком...');
    
    if (typeof THREE === 'undefined') {
        console.error('❌ Three.js не загружен!');
        return;
    }
    
    setTimeout(() => {
        try {
            window.ambulanceBackground = new SimpleAmbulanceBackground();
            console.log('✅ Фон с оригинальным РАФиком создан!');
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

console.log('✅ 3D фон с ОРИГИНАЛЬНЫМ .3ds файлом загружен');
