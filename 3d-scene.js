// РЕАЛИСТИЧНАЯ 3D СЦЕНА - МАШИНА СКОРОЙ ПОМОЩИ

class Medical3DScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.ambulance = null;
        this.lights = [];
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.init();
    }

    init() {
        console.log('🚑 Создаем реалистичную медицинскую сцену...');
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createEnvironment();
        this.createAmbulance();
        this.createEmergencyLights();
        this.createAtmosphere();
        this.setupEventListeners();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
        // Темный туманный фон для драматичности
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 100);
        this.scene.background = new THREE.Color(0x0f0f1a);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(15, 8, 20);
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
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.8;
        
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

    createEnvironment() {
        // Дорога/земля
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Основное освещение
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Главный прожектор
        const spotLight = new THREE.SpotLight(0xffffff, 1, 50, Math.PI / 6, 0.3);
        spotLight.position.set(0, 20, 10);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        this.scene.add(spotLight);
    }

    createAmbulance() {
        console.log('🚑 Создаем машину скорой помощи...');
        
        const ambulanceGroup = new THREE.Group();

        // Основной корпус машины
        const bodyGeometry = new THREE.BoxGeometry(6, 2.5, 3);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            shininess: 100
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.25;
        body.castShadow = true;
        ambulanceGroup.add(body);

        // Кабина
        const cabinGeometry = new THREE.BoxGeometry(2.5, 2, 3);
        const cabinMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            shininess: 100
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(2.5, 2.75, 0);
        cabin.castShadow = true;
        ambulanceGroup.add(cabin);

        // Красный крест на боку
        const crossGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.01);
        const crossMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        
        const crossH = new THREE.Mesh(crossGeometry, crossMaterial);
        crossH.position.set(0, 1.5, 1.51);
        ambulanceGroup.add(crossH);
        
        const crossV = new THREE.Mesh(crossGeometry, crossMaterial);
        crossV.rotation.z = Math.PI / 2;
        crossV.position.set(0, 1.5, 1.51);
        ambulanceGroup.add(crossV);

        // Колеса
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        
        const wheels = [
            { x: 2, z: 1.7 },   // Переднее правое
            { x: 2, z: -1.7 },  // Переднее левое
            { x: -2, z: 1.7 },  // Заднее правое
            { x: -2, z: -1.7 }  // Заднее левое
        ];

        wheels.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos.x, 0.5, pos.z);
            wheel.castShadow = true;
            ambulanceGroup.add(wheel);
        });

        // Мигалка на крыше
        const lightBarGeometry = new THREE.BoxGeometry(2, 0.3, 0.5);
        const lightBarMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            shininess: 50
        });
        const lightBar = new THREE.Mesh(lightBarGeometry, lightBarMaterial);
        lightBar.position.set(0, 3.9, 0);
        ambulanceGroup.add(lightBar);

        // Синие лампы мигалки
        const lampGeometry = new THREE.SphereGeometry(0.2, 16, 12);
        const blueLampMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x0066ff,
            emissive: 0x001133,
            transparent: true,
            opacity: 0.8
        });

        this.blueLamps = [];
        [-0.7, 0.7].forEach(x => {
            const lamp = new THREE.Mesh(lampGeometry, blueLampMaterial.clone());
            lamp.position.set(x, 4, 0);
            ambulanceGroup.add(lamp);
            this.blueLamps.push(lamp);
        });

        // Передние фары
        const headlightGeometry = new THREE.SphereGeometry(0.3, 16, 12);
        const headlightMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffaa,
            emissive: 0x333300,
            transparent: true,
            opacity: 0.9
        });

        this.headlights = [];
        [-1, 1].forEach(z => {
            const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial.clone());
            headlight.position.set(3.8, 1.2, z);
            ambulanceGroup.add(headlight);
            this.headlights.push(headlight);
        });

        this.ambulance = ambulanceGroup;
        this.scene.add(ambulanceGroup);
    }

    createEmergencyLights() {
        console.log('🚨 Создаем мигающие огни...');

        // Синие мигающие огни
        this.blueLight1 = new THREE.PointLight(0x0066ff, 0, 15);
        this.blueLight1.position.set(-0.7, 4.5, 0);
        this.scene.add(this.blueLight1);

        this.blueLight2 = new THREE.PointLight(0x0066ff, 0, 15);
        this.blueLight2.position.set(0.7, 4.5, 0);
        this.scene.add(this.blueLight2);

        // Белые фары
        this.headLight1 = new THREE.SpotLight(0xffffaa, 0.8, 30, Math.PI / 8, 0.2);
        this.headLight1.position.set(4, 1.2, -1);
        this.headLight1.target.position.set(10, 0, -1);
        this.scene.add(this.headLight1);
        this.scene.add(this.headLight1.target);

        this.headLight2 = new THREE.SpotLight(0xffffaa, 0.8, 30, Math.PI / 8, 0.2);
        this.headLight2.position.set(4, 1.2, 1);
        this.headLight2.target.position.set(10, 0, 1);
        this.scene.add(this.headLight2);
        this.scene.add(this.headLight2.target);
    }

    createAtmosphere() {
        // Дождевые частицы для атмосферы
        const rainGeometry = new THREE.BufferGeometry();
        const rainMaterial = new THREE.PointsMaterial({
            color: 0x9999ff,
            size: 0.1,
            transparent: true,
            opacity: 0.6
        });

        const rainVertices = [];
        for (let i = 0; i < 1000; i++) {
            rainVertices.push(
                Math.random() * 100 - 50,  // x
                Math.random() * 50,        // y
                Math.random() * 100 - 50   // z
            );
        }

        rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainVertices, 3));
        this.rain = new THREE.Points(rainGeometry, rainMaterial);
        this.scene.add(this.rain);

        // Световые блики на мокром асфальте
        const puddleGeometry = new THREE.CircleGeometry(2, 32);
        const puddleMaterial = new THREE.MeshPhongMaterial({
            color: 0x333366,
            transparent: true,
            opacity: 0.4,
            shininess: 100
        });

        for (let i = 0; i < 5; i++) {
            const puddle = new THREE.Mesh(puddleGeometry, puddleMaterial);
            puddle.rotation.x = -Math.PI / 2;
            puddle.position.set(
                (Math.random() - 0.5) * 30,
                0.01,
                (Math.random() - 0.5) * 30
            );
            this.scene.add(puddle);
        }
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.016; // ~60fps

        // Анимация мигающих огней
        this.animateEmergencyLights();
        
        // Анимация дождя
        this.animateRain();
        
        // Легкое покачивание машины (как будто работает двигатель)
        if (this.ambulance) {
            this.ambulance.rotation.z = Math.sin(this.time * 4) * 0.003;
            this.ambulance.position.y = Math.sin(this.time * 6) * 0.02;
        }

        // Камера слегка следует за мышью
        const targetX = this.mouse.x * 5;
        const targetY = this.mouse.y * 3 + 8;
        
        this.camera.position.x += (15 + targetX - this.camera.position.x) * 0.02;
        this.camera.position.y += (targetY - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 2, 0);

        this.renderer.render(this.scene, this.camera);
    }

    animateEmergencyLights() {
        // Попеременное мигание синих огней
        const frequency = this.time * 8;
        const flash1 = Math.sin(frequency) > 0 ? 1 : 0;
        const flash2 = Math.sin(frequency + Math.PI) > 0 ? 1 : 0;

        // Синие огни
        this.blueLight1.intensity = flash1 * 2;
        this.blueLight2.intensity = flash2 * 2;

        // Обновляем материалы ламп
        if (this.blueLamps) {
            this.blueLamps[0].material.emissive.setHex(flash1 ? 0x0044bb : 0x001133);
            this.blueLamps[1].material.emissive.setHex(flash2 ? 0x0044bb : 0x001133);
        }

        // Мерцание фар
        const headlightFlicker = 0.8 + Math.sin(this.time * 20) * 0.1;
        this.headLight1.intensity = headlightFlicker;
        this.headLight2.intensity = headlightFlicker;

        if (this.headlights) {
            this.headlights.forEach(light => {
                light.material.emissive.setScalar(headlightFlicker * 0.3);
            });
        }
    }

    animateRain() {
        if (this.rain) {
            const positions = this.rain.geometry.attributes.position.array;
            
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] -= 0.3; // Падение вниз
                
                if (positions[i] < 0) {
                    positions[i] = 50; // Сброс наверх
                }
            }
            
            this.rain.geometry.attributes.position.needsUpdate = true;
            this.rain.rotation.y += 0.001;
        }
    }
}

// Запуск сцены
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚑 Инициализация реалистичной медицинской сцены...');
    
    setTimeout(() => {
        if (typeof THREE !== 'undefined') {
            window.medical3DScene = new Medical3DScene();
            console.log('✅ Реалистичная 3D сцена создана!');
        } else {
            console.error('❌ Three.js не загружен');
        }
    }, 500);
});
