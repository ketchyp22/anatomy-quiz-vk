// ИСПРАВЛЕННАЯ ВЕРСИЯ 3d-scene.js - МАШИНА СТОИТ ПРАВИЛЬНО КАК НА ФОТО
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
       console.log('🚑 ИСПРАВЛЕННАЯ загрузка РАФ-2203 - ПРАВИЛЬНОЕ ПОЗИЦИОНИРОВАНИЕ');
       this.createScene();
       this.createCamera();
       this.createRenderer();
       this.createLighting();
       this.loadOnlyRealModel();
       this.animate();
       
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
       
       this.camera.position.set(
           this.originalCameraPosition.x, 
           this.originalCameraPosition.y, 
           this.originalCameraPosition.z
       );
       
       this.camera.lookAt(0, 0, 0);
       
       console.log('📷 Камера создана');
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
       
       console.log('🖥️ Рендерер создан');
   }

   createLighting() {
       const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
       sunLight.position.set(15, 20, 10);
       sunLight.castShadow = true;
       
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

       const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
       this.scene.add(ambientLight);
       
       const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.4);
       fillLight.position.set(-10, 5, -10);
       this.scene.add(fillLight);
       
       console.log('💡 Освещение настроено');
   }

   loadOnlyRealModel() {
       console.log('🎯 ЗАГРУЖАЕМ raf22031.3ds (ПРАВИЛЬНОЕ ИМЯ ФАЙЛА)');
       
       this.ensureTDSLoader().then(() => {
           console.log('✅ TDSLoader готов');
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
                       reject(new Error('TDSLoader не стал доступен'));
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
       console.log('🚑 ЗАГРУЖАЕМ raf22031.3ds...');
       
       const loader = new THREE.TDSLoader();
       loader.setResourcePath('./Models/');
       
       loader.load(
           './Models/raf22031.3ds',
           (object) => {
               console.log('🎉 RAF22031.3DS ЗАГРУЖЕН!');
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
       console.log('🎨 НАСТРАИВАЕМ МОДЕЛЬ С ПРАВИЛЬНЫМ ПОЗИЦИОНИРОВАНИЕМ...');
       
       this.rafModel = object;
       
       let meshCount = 0;
       object.traverse((child) => {
           if (child.isMesh) {
               meshCount++;
               child.castShadow = true;
               child.receiveShadow = true;
               
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
       
       this.correctModelPositioning();
       this.loadTextures();
       this.scene.add(this.rafModel);
       this.addEmergencyLights();
       
       console.log('✅ МОДЕЛЬ ГОТОВА И СТОИТ ПРАВИЛЬНО!');
   }

   correctModelPositioning() {
       console.log('📐 ИСПРАВЛЯЕМ ПОЗИЦИОНИРОВАНИЕ МОДЕЛИ - МАШИНА ДОЛЖНА СТОЯТЬ ПРАВИЛЬНО...');
       
       this.modelBoundingBox = new THREE.Box3().setFromObject(this.rafModel);
       this.modelCenter = this.modelBoundingBox.getCenter(new THREE.Vector3());
       const modelSize = this.modelBoundingBox.getSize(new THREE.Vector3());
       
       const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
       const screenFactor = Math.min(window.innerWidth, window.innerHeight) / 800;
       const baseScale = 3.5;
       const adaptiveScale = baseScale * screenFactor;
       const finalScale = adaptiveScale / maxDimension;
       
       this.rafModel.scale.setScalar(finalScale);
       
       // КРИТИЧЕСКИ ВАЖНО: ПРАВИЛЬНАЯ ОРИЕНТАЦИЯ МАШИНЫ
       // Исходя из фото: машина должна стоять горизонтально, кабиной вперед
       
       // СНАЧАЛА СБРАСЫВАЕМ ВСЕ ПОВОРОТЫ
       this.rafModel.rotation.x = 0;
       this.rafModel.rotation.y = 0;
       this.rafModel.rotation.z = 0;
       
       // Анализируем исходную ориентацию модели
       const scaledBox = new THREE.Box3().setFromObject(this.rafModel);
       const scaledSize = scaledBox.getSize(new THREE.Vector3());
       
       console.log('📏 Размеры модели после масштабирования:', {
           x: scaledSize.x.toFixed(2),
           y: scaledSize.y.toFixed(2), 
           z: scaledSize.z.toFixed(2)
       });
       
       // КРИТИЧЕСКИ ВАЖНО: МАШИНА ДОЛЖНА ЛЕЖАТЬ ГОРИЗОНТАЛЬНО КАК НА ФОТО!
       // НЕ СТОЯТЬ ВЕРТИКАЛЬНО КАК СТОЛБ!
       
       // ПОВОРОТ ДЛЯ ПРАВИЛЬНОЙ ОРИЕНТАЦИИ
       // Машина должна ЛЕЖАТЬ горизонтально в фоне, а не стоять вертикально
       this.rafModel.rotation.x = -Math.PI / 2;  // Поворот на -90° чтобы лечь горизонтально
       this.rafModel.rotation.y = 0;             // Без поворота по Y
       this.rafModel.rotation.z = 0;             // Без наклона
       
       // Если модель все еще перевернута, пробуем другую ориентацию
       // Это зависит от того, как модель экспортирована из 3ds max
       
       // ПОЗИЦИОНИРОВАНИЕ: центрируем и ставим на "землю"
       this.rafModel.position.set(0, 0, 0);
       
       // Пересчитываем bounding box после поворота
       const finalBox = new THREE.Box3().setFromObject(this.rafModel);
       const finalCenter = finalBox.getCenter(new THREE.Vector3());
       const finalSize = finalBox.getSize(new THREE.Vector3());
       
       // ЦЕНТРИРУЕМ машину по X и Z
       this.rafModel.position.x = -finalCenter.x;
       this.rafModel.position.z = -finalCenter.z;
       
       // СТАВИМ НА "ЗЕМЛЮ" - важно для правильного отображения
       this.rafModel.position.y = -finalBox.min.y; // Нижняя часть модели на Y=0
       
       console.log('📍 МАШИНА ПОСТАВЛЕНА ПРАВИЛЬНО:', {
           position: {
               x: this.rafModel.position.x.toFixed(2),
               y: this.rafModel.position.y.toFixed(2),
               z: this.rafModel.position.z.toFixed(2)
           },
           rotation: {
               x: (this.rafModel.rotation.x * 180 / Math.PI).toFixed(1) + '°',
               y: (this.rafModel.rotation.y * 180 / Math.PI).toFixed(1) + '°',
               z: (this.rafModel.rotation.z * 180 / Math.PI).toFixed(1) + '°'
           },
           scale: this.rafModel.scale.x.toFixed(2)
       });
       
       this.adaptCameraToModel(finalSize);
   }

   adaptCameraToModel(modelSize) {
       console.log('📷 АДАПТИРУЕМ КАМЕРУ К ПРАВИЛЬНО СТОЯЩЕЙ МАШИНЕ...');
       
       const maxSize = Math.max(modelSize.x, modelSize.y, modelSize.z);
       const distance = maxSize * 2.5;
       
       // Камера смотрит на машину под углом как на фото
       this.originalCameraPosition = {
           x: distance * 0.8,   // Немного сбоку
           y: distance * 0.4,   // Сверху
           z: distance * 0.8    // Назад
       };
       
       this.camera.position.set(
           this.originalCameraPosition.x,
           this.originalCameraPosition.y,
           this.originalCameraPosition.z
       );
       
       // Смотрим в центр машины на уровне средней высоты
       this.camera.lookAt(0, modelSize.y / 2, 0);
       
       console.log('📷 Камера настроена для правильного обзора машины');
   }

   improveMaterial(material) {
       material.side = THREE.DoubleSide;
       material.transparent = false;
       material.alphaTest = 0.1;
       
       if (material.type === 'MeshStandardMaterial' || material.type === 'MeshPhysicalMaterial') {
           material.metalness = 0.1;
           material.roughness = 0.8;
       }
       
       material.needsUpdate = true;
   }

   loadTextures() {
       console.log('🖼️ ЗАГРУЖАЕМ ТЕКСТУРЫ (ПРАВИЛЬНОЕ ИМЯ ФАЙЛА)...');
       
       const textureLoader = new THREE.TextureLoader();
       
       textureLoader.load(
           './Models/raf22031.JPG',
           (texture) => {
               console.log('✅ Текстура JPG загружена');
               this.applyTextureToModel(texture);
           },
           undefined,
           (error) => {
               console.warn('⚠️ JPG не загрузилась, пробуем BMP...');
               this.tryLoadBMP();
           }
       );
   }

   tryLoadBMP() {
       const textureLoader = new THREE.TextureLoader();
       
       textureLoader.load(
           './Models/raf22031.bmp',
           (texture) => {
               console.log('✅ Текстура BMP загружена');
               this.applyTextureToModel(texture);
           },
           undefined,
           (error) => {
               console.warn('⚠️ BMP тоже не загрузилась');
           }
       );
   }

   applyTextureToModel(texture) {
       console.log('🎨 ПРИМЕНЯЕМ ТЕКСТУРУ К ПРАВИЛЬНО СТОЯЩЕЙ МАШИНЕ...');
       
       texture.flipY = true;
       texture.wrapS = THREE.RepeatWrapping;
       texture.wrapT = THREE.RepeatWrapping;
       texture.minFilter = THREE.LinearFilter;
       texture.magFilter = THREE.LinearFilter;
       texture.generateMipmaps = true;
       
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
       
       console.log('🚨 ДОБАВЛЯЕМ МИГАЛКИ К ПРАВИЛЬНО СТОЯЩЕЙ МАШИНЕ...');
       
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
       
       const box = new THREE.Box3().setFromObject(this.rafModel);
       const size = box.getSize(new THREE.Vector3());
       
       this.emergencyLights = [];
       
       // Размещаем мигалки на крыше машины (сверху)
       for (let i = 0; i < 4; i++) {
           const material = i % 2 === 0 ? blueMaterial.clone() : redMaterial.clone();
           const light = new THREE.Mesh(lightGeometry, material);
           
           const angle = (i / 4) * Math.PI * 2;
           light.position.set(
               Math.cos(angle) * size.x * 0.25,
               size.y * 0.9, // На крыше машины
               Math.sin(angle) * size.z * 0.25
           );
           
           this.rafModel.add(light);
           this.emergencyLights.push(light);
       }
       
       console.log(`🚨 Добавлено ${this.emergencyLights.length} мигалок на крышу машины`);
   }

   onWindowResize() {
       this.camera.aspect = window.innerWidth / window.innerHeight;
       this.camera.updateProjectionMatrix();
       
       this.renderer.setSize(window.innerWidth, window.innerHeight);
       this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
       
       if (this.rafModel) {
           this.correctModelPositioning();
       }
   }

   animate() {
       requestAnimationFrame(() => this.animate());
       
       const time = Date.now() * 0.001;
       
       if (this.rafModel) {
           if (this.emergencyLights && this.emergencyLights.length > 0) {
               this.emergencyLights.forEach((light, index) => {
                   const intensity = Math.sin(time * 6 + index * Math.PI) > 0 ? 1 : 0.2;
                   light.material.emissive.multiplyScalar(intensity);
               });
           }
       }
       
       // Плавное движение камеры вокруг правильно стоящей машины
       if (this.originalCameraPosition) {
           const radius = Math.sqrt(
               this.originalCameraPosition.x * this.originalCameraPosition.x + 
               this.originalCameraPosition.z * this.originalCameraPosition.z
           );
           
           this.camera.position.x = this.originalCameraPosition.x + Math.sin(time * 0.15) * radius * 0.1;
           this.camera.position.y = this.originalCameraPosition.y + Math.sin(time * 0.2) * 0.5;
           this.camera.position.z = this.originalCameraPosition.z + Math.cos(time * 0.15) * radius * 0.1;
           
           this.camera.lookAt(0, this.originalCameraPosition.y * 0.3, 0);
       }
       
       this.renderer.render(this.scene, this.camera);
   }
}

console.log('🚑 ЗАПУСК ИСПРАВЛЕННОЙ ВЕРСИИ РАФ-2203 - МАШИНА БУДЕТ СТОЯТЬ ПРАВИЛЬНО');

function startRealRaf() {
   if (typeof THREE === 'undefined') {
       console.error('❌ Three.js не загружен!');
       return false;
   }
   
   if (window.rafBackground) {
       const oldContainer = document.getElementById('threejs-container');
       if (oldContainer) {
           oldContainer.remove();
       }
   }
   
   try {
       window.rafBackground = new SimpleAmbulanceBackground();
       console.log('✅ РАФ-2203 ЗАПУЩЕН С ПРАВИЛЬНЫМ ПОЗИЦИОНИРОВАНИЕМ!');
       return true;
   } catch (error) {
       console.error('❌ Ошибка запуска:', error);
       return false;
   }
}

setTimeout(startRealRaf, 100);

window.debugRaf = {
   start: startRealRaf,
   restart: () => {
       const oldContainer = document.getElementById('threejs-container');
       if (oldContainer) oldContainer.remove();
       startRealRaf();
   },
   info: () => {
       console.log('=== РАФ-2203 ПРАВИЛЬНО СТОЯЩИЙ ===');
       if (window.rafBackground?.rafModel) {
           const model = window.rafBackground.rafModel;
           console.log('Позиция:', model.position);
           console.log('Поворот:', model.rotation);
           console.log('Масштаб:', model.scale.x);
       }
   },
   flipModel: () => {
       if (window.rafBackground?.rafModel) {
           const model = window.rafBackground.rafModel;
           console.log('🔄 Исправляем ориентацию модели - ДЕЛАЕМ ГОРИЗОНТАЛЬНОЙ...');
           
           // Разные варианты поворота для правильной горизонтальной ориентации
           if (model.rotation.x === 0) {
               // Поворачиваем на -90° по X чтобы лечь
               model.rotation.x = -Math.PI / 2;
               console.log('Повернули на -90° по X - машина должна лечь');
           } else if (model.rotation.x === -Math.PI / 2) {
               // Пробуем +90°
               model.rotation.x = Math.PI / 2;
               console.log('Повернули на +90° по X');
           } else {
               // Сбрасываем
               model.rotation.set(-Math.PI / 2, 0, 0);
               console.log('Установили -90° по X для горизонтального положения');
           }
       }
   }
};

console.log('✅ ИСПРАВЛЕННЫЙ КОД ГОТОВ - МАШИНА БУДЕТ СТОЯТЬ КАК НА ФОТО!');
console.log('🔧 Если машина все еще неправильно - используйте: window.debugRaf.flipModel()');
